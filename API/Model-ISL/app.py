from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import pandas as pd
import mediapipe as mp
import itertools
import copy
import string
from tensorflow import keras

app = Flask(__name__)
CORS(app)

# Load model
model = keras.models.load_model("model.h5")

# Alphabet mapping
alphabet = ['1','2','3','4','5','6','7','8','9'] + list(string.ascii_uppercase)

# Mediapipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1)

def calc_landmark_list(image, landmarks):
    image_width, image_height = image.shape[1], image.shape[0]
    return [[min(int(l.x * image_width), image_width - 1),
             min(int(l.y * image_height), image_height - 1)]
             for l in landmarks.landmark]

def pre_process_landmark(landmark_list):
    temp = copy.deepcopy(landmark_list)
    base_x, base_y = temp[0]
    temp = [[x - base_x, y - base_y] for x, y in temp]
    flat = list(itertools.chain.from_iterable(temp))
    max_value = max(map(abs, flat))
    return list(map(lambda n: n / max_value if max_value else 0, flat))

@app.route('/predict/isl', methods=['POST'])
def predict_sign():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    img_bytes = file.read()
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)

    if not results.multi_hand_landmarks:
        return jsonify({"error": "No hand detected"}), 400

    landmarks = results.multi_hand_landmarks[0]
    landmark_list = calc_landmark_list(img, landmarks)
    pre_processed = pre_process_landmark(landmark_list)
    df = pd.DataFrame(pre_processed).T

    predictions = model.predict(df, verbose=0)
    predicted_class = np.argmax(predictions, axis=1)[0]
    label = alphabet[predicted_class]
    confidence = float(np.max(predictions))

    return jsonify({
        "prediction": label,
        "confidence": round(confidence * 100, 2)
    })

if __name__ == "__main__":
    app.run(port=5000)
