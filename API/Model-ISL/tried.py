from flask import Flask, request, jsonify
import cv2
import numpy as np
import copy, itertools
import mediapipe as mp
from tensorflow.keras.models import load_model

app = Flask(__name__)

model = load_model("model.h5")
alphabet = ['1','2','3','4','5','6','7','8','9'] + list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

# ... include calc_landmark_list() and pre_process_landmark() functions here ...

@app.route('/predict/isl', methods=['POST'])
def predict_isl():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    img = cv2.flip(img, 1)

    mp_hands = mp.solutions.hands
    with mp_hands.Hands(static_image_mode=True, max_num_hands=1) as hands:
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = hands.process(img_rgb)

        if not results.multi_hand_landmarks:
            return jsonify({'detections': []})

        landmarks = results.multi_hand_landmarks[0]
        landmark_list = calc_landmark_list(img, landmarks)
        processed = pre_process_landmark(landmark_list)
        input_data = np.array([processed])

        prediction = model.predict(input_data)[0]
        class_id = np.argmax(prediction)
        confidence = round(float(np.max(prediction)) * 100, 2)

        return jsonify({
            'detections': [{
                'label': alphabet[class_id],
                'confidence': confidence
            }]
        })

if __name__ == "__main__":
    app.run(debug=True)
