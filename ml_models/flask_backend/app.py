from flask import Flask, request, jsonify
from PIL import Image
from flask_cors import CORS
import torch
import io
import json
from model import model, preprocess, class_names
# from service import save_image_to_service

app = Flask(__name__)
CORS(app)

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
    if predicted_class_name in ['bathroom', 'bedroom', 'kitchen','living','dining']:  # Replace with actual room classes
        # # Extract authorization header and additional parameters from the request
        # print("request form",request.form)
        # authorization_header = request.headers.get('Authorization')
        # folder_id = request.form.get('folderId')
    
        # print("Authorization_Header",authorization_header)
        # print("folderId",folder_id)
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
