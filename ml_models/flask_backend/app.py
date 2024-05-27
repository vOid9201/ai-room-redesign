from flask import Flask, request, jsonify ,send_from_directory
from PIL import Image
from flask_cors import CORS
import torch
import io
import json
import os
import numpy as np
import requests
from ultralytics import YOLO
from model import model, preprocess, class_names
from coco_names import get_coco_category_names as get_names , REQUIRED_OBJECTS as required_objects
from utils import download_images, create_mask,create_prompt
from dotenv import load_dotenv
from io import BytesIO
# Load environment variables from .env file
load_dotenv()
# from service import save_image_to_service

app = Flask(__name__)
CORS(app)
API_KEY = os.getenv('API_KEY')

@app.route('/predict-instance', methods=['POST'])
def predict_instance():
    data = request.get_json()
    image_url = data.get('image_url')
    print(image_url)
    # print(image_url)
    if image_url is None:
        return jsonify({'error':'No image url provided'}),400
    model = YOLO('yolov8s-seg.pt')
    # image_file = request.files['image']
    # image = Image.open(image_file).convert('RGB')
    results = model(image_url)

    result=[]    
    for r in results:
        # r.save()
        xy = r.masks.xy
        r = r.cpu().numpy()
        print(r.boxes)
        # print(xy)
        names = get_names(r.boxes.cls)
        data =  [{"cls": int(r.boxes.cls[i]),"object_names":names[i],"conf": float(r.boxes.conf[i]),"coordinates": xy[i].tolist()} for i in range(len(r.boxes.conf)) if names[i] in required_objects]

        result.append(data)

    result = json.dumps(result)
    return jsonify({
        'results':result
    })


@app.route('/predict', methods=['POST'])
def predict():
    print(class_names)
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    # Load the image
    image_file = request.files['image']
    image = Image.open(image_file).convert('RGB')

    # print(image);

    # Preprocess the image
    input_tensor = preprocess(image)
    input_batch = input_tensor.unsqueeze(0)  # Create a mini-batch as expected by the model

    # Move the input to the appropriate device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    input_batch = input_batch.to(device)
    model.to(device)

    # Make prediction
    with torch.no_grad():
        output = model(input_batch)
        print(output)
    probabilities = torch.nn.functional.softmax(output[0], dim=0)
    _, predicted_class = torch.max(output, 1)

    predicted_class_index = str(predicted_class.item())  # Convert to string to match dictionary keys
    # print("Predicted Class Index" , predicted_class_index)
    if predicted_class_index not in class_names:
        return jsonify({'error': f'Class index {predicted_class_index} not found in class names'}), 500


    predicted_class_name = class_names[predicted_class_index]
    probability = probabilities[predicted_class].item()

    # If recognized as a room, send the image to another backend service
    if predicted_class_name in ['bathroom', 'bedroom', 'kitchen','living','dining']:
        print("predicted_class",predicted_class_name)
        return jsonify({
            'predicted_class': predicted_class_name,
            'probability': probability,
        })

    return jsonify({
        'predicted_class': predicted_class_name,
        'probability': probability
    })


@app.route('/edit-image',methods=['POST'])
def edit_images():
    try:
        data=request.json
        print("data",data)
        image_url = data['image_url']
        coordinates = data['coordinates']
        color = "#0000FF"
        style = data['objectStyle']
        name = "couch"

        image = download_images(image_url)
        image_size = image.size
        mask = create_mask(image_size,coordinates)

        image_path = "image.png"
        mask_path = "mask.png"
        # image.save(image_path)
        # mask.save(mask_path)

        with open(image_path, "wb") as img_file:
            image.save(img_file, format='PNG')
        
        with open(mask_path, "wb") as mask_file:
            mask.save(mask_file, format='PNG')


        prompt = create_prompt(color,name,style)

        url = "https://api.openai.com/v1/images/edits"
        headers = {
            "Authorization": f"Bearer {API_KEY}"
        }
        with open(image_path, "rb") as img_file, open(mask_path, "rb") as mask_file:
            files = {
                "model": (None, "dall-e-2"),
                "image": (image_path, img_file),
                "mask": (mask_path, mask_file),
                "prompt": (None, prompt),
                "n": (None, "1"),
                "size": (None, "512x512")
            }
            response = requests.post(url, headers=headers, files=files)
        
        # response = requests.post(url,headers,files,data)
        # os.remove(image_path)
        # os.remove(mask_path)
        if response.status_code == 200:
            response_json = response.json()
            print("response ", response_json)
            edited_image_url = response_json['data'][0]['url']

            edited_image_response = requests.get(edited_image_url)
            edited_image_content = BytesIO(edited_image_response.content)
            edited_image_content.seek(0)
            edited_image_name = "edited_image.png"
            edited_image_path = os.path.join('static', edited_image_name)


            with open(edited_image_path ,"wb") as f:
                f.write(edited_image_content.read())
            
            proxied_image_url = f"http://localhost:8080/static/{edited_image_name}"
            return jsonify({
                "proxied_image_url":proxied_image_url
            })

            # return jsonify(response.json())
        else:
            return jsonify(response.json()), response.status_code

    except Exception as e:
        return jsonify({"error":str(e)}),500
    
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static',filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)  # Change 8080 to your preferred port
