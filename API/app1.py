from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import os
import cv2

app = Flask(__name__)
CORS(app)  # Allow React to connect

model = YOLO("best.pt")  # Load YOLO model

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files['image']
    image_path = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(image_path)

    # Load and process image
    img = cv2.imread(image_path)
    results = model(img)

    detected_labels = []
    for r in results:
        for box in r.boxes:
            class_id = int(box.cls)  
            confidence = float(box.conf)  
            label = f"{model.names[class_id]} ({confidence * 100:.2f}%)"
            detected_labels.append(label)

            # Draw bounding box
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 2)  # Dark blue box
            cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)

    # Save the result image
    output_path = os.path.join(UPLOAD_FOLDER, "output.jpg")
    cv2.imwrite(output_path, img)

    return jsonify({"predictions": detected_labels, "image_url": f"http://localhost:5000/uploads/output.jpg"})

# Route to serve images
@app.route('/uploads/<filename>')
def get_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
