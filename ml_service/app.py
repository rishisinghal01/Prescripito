from flask import Flask, request, jsonify
import numpy as np
import cv2
import joblib
import base64
import os

app = Flask(__name__)

model_path = os.path.join(os.path.dirname(__file__), 'disease_model.pkl')
try:
    model = joblib.load(model_path)
    print("ML Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Labels mapping
classes = {
    0: "Normal Skin (No immediate concern detected)",
    1: "Erythema / Contact Dermatitis (Skin Rash/Redness detected)",
    2: "Melanoma Suspicion (Dark abnormal spot detected)",
    3: "Acne Vulgaris (Pimples/Inflamed spots detected)",
    4: "Psoriasis Suspicion (Silvery/Red scales detected)",
    5: "Vitiligo Suspicion (Depigmented patches detected)",
    6: "Jaundice Suspicion (Yellowing of skin/sclera detected)",
    7: "Measles Suspicion (Red blotchy rash detected)",
    8: "Conjunctivitis Suspicion (Pink/Red eye detected)",
    9: "Chickenpox Suspicion (Blister-like rash detected)",
    10: "Hand, Foot, Mouth Disease Suspicion",
    11: "Brain MRI: Normal (No anomalies detected)",
    12: "Brain MRI: Tumor Suspicion (Abnormal mass detected)",
    13: "Brain MRI: Hemorrhage Suspicion (Abnormal fluid detected)",
    14: "Endoscopy: Normal Mucosa",
    15: "Endoscopy: Peptic Ulcer Suspicion",
    16: "Endoscopy: Polyps Suspicion",
    17: "Ultrasound: Normal",
    18: "Ultrasound: Cyst / Mass Suspicion",
    19: "Chest X-Ray: Normal",
    20: "Chest X-Ray: Nodule / Tumor Suspicion",
    21: "Chest X-Ray: Pneumonia Infiltrates Suspicion"
}

def extract_features(img):
    # This is a highly simplified feature extractor mimicking a real pipeline.
    # We calculate the mean RGB/Grayscale values of the central region.
    h, w = img.shape[:2]
    center_region = img[int(h*0.3):int(h*0.7), int(w*0.3):int(w*0.7)]
    mean_color = cv2.mean(center_region)
    # OpenCV loads images in BGR format, so we return [R, G, B]
    return [mean_color[2], mean_color[1], mean_color[0]]

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.get_json()
    base64_img = data.get('image', None)
    
    if not base64_img:
        return jsonify({"error": "No image provided"}), 400

    try:
        # Remove header if present
        if ',' in base64_img:
            base64_img = base64_img.split(',')[1]
        
        img_data = base64.b64decode(base64_img)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid image data"}), 400

        features = extract_features(img)
        prediction = model.predict([features])[0]
        
        diagnosis = classes.get(prediction, "Unknown Condition")

        return jsonify({
            "success": True,
            "diagnosis": diagnosis,
            "features_extracted": {
                "R_mean": round(features[0], 2),
                "G_mean": round(features[1], 2),
                "B_mean": round(features[2], 2)
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
