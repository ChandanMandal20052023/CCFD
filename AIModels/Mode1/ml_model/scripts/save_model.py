import os
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score


from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from imblearn.over_sampling import SMOTE

# ==============================
# LOAD & PREPROCESS DATA
# ==============================

def load_data():
    """Load and clean the credit card transaction dataset."""
    print("Loading data...")

    # Robust path handling: relative to this script's location
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, "..", "data", "creditcard.csv")

    try:
        data = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: {data_path} not found. Please ensure the dataset is in the 'data' folder.")
        return None

    # Cleaning: Removing duplicates as they usually represent data entry errors
    data = data.drop_duplicates()
    
    # Dropping 'Time' as it's often a sequential ID rather than a predictive feature
    data = data.drop(['Time'], axis=1, errors='ignore')

    print(f"Data Loaded Successfully. Shape: {data.shape}")
    return data

# ==============================
# PREPARE DATA
# ==============================

def prepare_data(data):
    """Split data into training and testing sets, then scale and balance."""
    X = data.drop('Class', axis=1)
    y = data['Class']

    # 80/20 train-test split with stratification to maintain fraud ratio
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # Scaling: Essential for sensitive models like Logistic Regression
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # SMOTE: Handling extreme class imbalance (improving fraud detection)
    print("Applying SMOTE to balance classes...")
    sm = SMOTE(random_state=42)
    X_train_res, y_train_res = sm.fit_resample(X_train_scaled, y_train)

    return X_train_res, X_test_scaled, y_train_res, y_test, scaler, X.columns

# ==============================
# TRAIN MODELS
# ==============================

def train_models(X_train, y_train):
    """Train multiple classifiers for comparison."""
    print("\nTraining models (this may take a minute)...")

    # Logistic Regression (Baseline)
    print("- Training Logistic Regression...")
    lr_model = LogisticRegression(max_iter=1000, n_jobs=-1)
    lr_model.fit(X_train, y_train)

    # Random Forest (Ensemble)
    print("- Training Random Forest...")
    rf_model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)

    

    return lr_model, rf_model

# ==============================
# EVALUATE MODELS
# ==============================

def evaluate_model(model, X_test, y_test, name, threshold=0.6):
    """Evaluate a model and show visual confusion matrix."""
    print(f"\n===== Performance: {name} =====")

    y_probs = model.predict_proba(X_test)[:, 1]
    y_pred = (y_probs > threshold).astype(int)

    # Print Text Metrics
    print("\nConfusion Matrix (Raw):")
    cm = confusion_matrix(y_test, y_pred)
    print(cm)

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Visual Confusion Matrix (Heatmap)
    try:
        plt.figure(figsize=(6,4))
        sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
        plt.title(f"Confusion Matrix: {name}")
        plt.xlabel("Predicted Label")
        plt.ylabel("Actual Label")
        plt.show()
    except Exception as e:
        print(f"Warning: Could not display plot for {name} ({e})")

def show_feature_importance(model, feature_names):
    """Visualize the top 10 features that drive detections."""
    try:
        plt.figure(figsize=(10, 6))
        feat_importances = pd.Series(model.feature_importances_, index=feature_names)
        feat_importances.nlargest(10).plot(kind='barh', color='teal')
        plt.title('Top 10 Most Predictive Features (Random Forest)')
        plt.xlabel('Importance Score')
        plt.show()
    except Exception as e:
        print(f"Warning: Could not display feature importance plot ({e})")

# ==============================
# SAVE MODELS
# ==============================

def save_models(models, scaler):
    """Save trained artifacts to the project's 'models' folder."""
    print("\nSaving models to 'ml_model/models/'...")

    # Ensure path is always relative to the script's root
    current_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(current_dir, "..", "models")
    
    # Create directory if it doesn't exist
    os.makedirs(models_dir, exist_ok=True)

    joblib.dump(models["logistic"], os.path.join(models_dir, "logistic_model.pkl"))
    joblib.dump(models["random_forest"], os.path.join(models_dir, "random_forest_model.pkl"))
    joblib.dump(models["xgboost"], os.path.join(models_dir, "xgboost_model.pkl"))
    joblib.dump(scaler, os.path.join(models_dir, "scaler.pkl"))

    print("All models and the scaler were saved successfully!")


# ==============================
# MAIN PIPELINE
# ==============================
def main():
    # 1. Loading
    data = load_data()
    if data is None:
        return

    # 2. Preprocessing
    X_train, X_test, y_train, y_test, scaler, feature_names = prepare_data(data)

    # 3. Training
    lr_model, rf_model = train_models(X_train, y_train)

    # 4. Evaluation
    evaluate_model(lr_model, X_test, y_test, "Logistic Regression")
    evaluate_model(rf_model, X_test, y_test, "Random Forest")

    # 5. Visual Insights
    show_feature_importance(rf_model, feature_names)

    # 6. Persistence
    model_dict = {
        "logistic": lr_model,
        "random_forest": rf_model,
    }
    save_models(model_dict, scaler)

    print("\n✅ Training Pipeline Complete.")


if __name__ == "__main__":
    main()