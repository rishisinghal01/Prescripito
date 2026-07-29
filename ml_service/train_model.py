
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

print("Generating synthetic dataset for Medical Image Classification...")

# We simulate a feature extraction pipeline. 
# In a real model, these would be color histograms or deep CNN features.
# For this project, we create synthetic feature vectors (3 values: R, G, B mean values)

# Classes: 22 Medical Conditions mapped to Specialities
samples_per_class = 200
X = []
y = []

def add_class(label, r_mean, g_mean, b_mean, noise=15):
    for _ in range(samples_per_class):
        X.append([np.random.normal(r_mean, noise), np.random.normal(g_mean, noise), np.random.normal(b_mean, noise)])
        y.append(label)

# Dermatologist (Skin Conditions)
add_class(0, 190, 150, 130)  # 0: Normal Skin
add_class(1, 230, 100, 100)  # 1: Erythema / Contact Dermatitis
add_class(2, 50, 40, 40)     # 2: Melanoma Suspicion
add_class(3, 210, 120, 120)  # 3: Acne Vulgaris
add_class(4, 200, 170, 170, 10)  # 4: Psoriasis (Silvery scales)
add_class(5, 240, 240, 230, 5)   # 5: Vitiligo (Depigmentation)

# General Physician
add_class(6, 220, 220, 100, 10)  # 6: Jaundice (Yellow skin/eyes)
add_class(7, 215, 90, 90)    # 7: Measles (Red blotchy)
add_class(8, 220, 150, 160)  # 8: Conjunctivitis (Pink/Red eye)

# Pediatrician
add_class(9, 210, 130, 130)  # 9: Chickenpox
add_class(10, 200, 110, 110) # 10: Hand, Foot, Mouth Disease

# Neurologist (MRI Scans - Grayscale)
add_class(11, 80, 80, 80)    # 11: Brain MRI - Normal
add_class(12, 110, 110, 110) # 12: Brain MRI - Tumor Suspicion
add_class(13, 140, 140, 140) # 13: Brain MRI - Hemorrhage

# Gastroenterologist (Endoscopy - Pinkish/Red)
add_class(14, 220, 140, 140) # 14: Endoscopy - Normal
add_class(15, 200, 50, 50)   # 15: Endoscopy - Peptic Ulcer
add_class(16, 230, 160, 160) # 16: Endoscopy - Polyps

# Gynecologist / Imaging (Ultrasound - Grayscale)
add_class(17, 60, 60, 60)    # 17: Ultrasound - Normal
add_class(18, 90, 90, 90)    # 18: Ultrasound - Cyst/Mass

# Pulmonologist (X-Rays - Grayscale)
add_class(19, 150, 150, 150) # 19: Chest X-Ray - Normal
add_class(20, 120, 120, 120) # 20: Chest X-Ray - Nodule Suspicion
add_class(21, 180, 180, 180) # 21: Chest X-Ray - Pneumonia

X = np.array(X)
y = np.array(y)

print(f"Dataset generated. Total samples: {len(X)}")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training Random Forest Classifier...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
acc = accuracy_score(y_test, preds)
print(f"Model trained successfully! Validation Accuracy: {acc * 100:.2f}%")

model_path = os.path.join(os.path.dirname(__file__), 'disease_model.pkl')
joblib.dump(model, model_path)
print(f"Model saved to {model_path}")
