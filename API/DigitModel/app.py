from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn.functional as F
import numpy as np
import cv2
from model import DigitClassifier

app = Flask(__name__)
CORS(app)

model = DigitClassifier()
model.load_state_dict(torch.load("digit_classifier.pt", map_location=torch.device('cpu')))
model.eval()

def preprocess_image(image_bytes):
    img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (28, 28))
    img = img / 255.0
    img = np.expand_dims(img, axis=(0, 1))
    return torch.tensor(img, dtype=torch.float32)

@app.route('/predict/digit', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image_bytes = request.files['image'].read()
    input_tensor = preprocess_image(image_bytes)

    with torch.no_grad():
        output = model(input_tensor)
        probs = F.softmax(output, dim=1)
        prediction = torch.argmax(probs, dim=1).item()
        confidence = torch.max(probs).item()

    return jsonify({
        "digit": prediction,
        "confidence": round(confidence * 100, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)
