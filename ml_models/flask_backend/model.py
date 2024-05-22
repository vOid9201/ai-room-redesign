# model.py
import torch
from torchvision import transforms, models
import json

def get_resnet50_model(num_classes):
    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    num_ftrs = model.fc.in_features
    model.fc = torch.nn.Linear(num_ftrs, num_classes)
    return model

# Load the model
num_classes = 6  # Replace with the number of classes in your dataset
model = get_resnet50_model(num_classes)
model.load_state_dict(torch.load('room_classifier_resnet50.pth', map_location=torch.device('cuda' if torch.cuda.is_available() else 'cpu')))
model.eval()  # Set the model to evaluation mode

# Define the image preprocessing pipeline
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Load class names
def load_class_names(class_names_path):
    with open(class_names_path, 'r') as f:
        class_names = json.load(f)
    return class_names

class_names = load_class_names('class_names.json')  # Replace with the path to your class names file
# print(class_names)