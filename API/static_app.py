from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os

app = Flask(__name__)
CORS(app)

# Load trained model
model = YOLO("best.pt")  # Ensure best.pt exists in the same directory

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/translate', methods=['POST'])
def translate():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files['image']
    image_path = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(image_path)

    # Run YOLO inference
    results = model(image_path)

    # Extract detected class names
    detected_labels = []
    for r in results:
        for box in r.boxes:
            class_id = int(box.cls)
            if class_id in model.names:
                detected_labels.append(model.names[class_id])
            else:
                detected_labels.append(f"Unknown Class {class_id}")

    if not detected_labels:
        return jsonify({"message": "No sign detected"}), 200

    return jsonify({"predictions": detected_labels})

if __name__ == '__main__':
    app.run(debug=True)
