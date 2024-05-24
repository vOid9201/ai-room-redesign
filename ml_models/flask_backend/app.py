from flask import Flask, request, jsonify
from PIL import Image
from flask_cors import CORS
import torch
import io
import json
import numpy as np
from ultralytics import YOLO
from model import model, preprocess, class_names
from coco_names import get_coco_category_names as get_names , REQUIRED_OBJECTS as required_objects
# from service import save_image_to_service

app = Flask(__name__)
CORS(app)

@app.route('/predict-instance', methods=['POST'])
def predict_instance():
    if 'image' not in request.files:
        return jsonify({'error':'No image provided'}),400
    model = YOLO('yolov8s-seg.pt')
    image_file = request.files['image']
    image = Image.open(image_file).convert('RGB')
    results = model(image)

    result=[]    
    for r in results:
        # r.save()
        xy = r.masks.xy
        r = r.cpu().numpy()
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)  # Change 8080 to your preferred port
