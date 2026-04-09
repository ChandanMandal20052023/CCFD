from django.http import JsonResponse, HttpResponse
from django.contrib.auth.hashers import make_password, check_password
from .models import Transaction, User, MLTrainingDataIndia, LiveTransaction
from .serializers import LiveTransactionSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
import os
from django.views.decorators.csrf import csrf_exempt
import json
import secrets


# 📝 Register API
@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = body.get("username")
    email = body.get("email")
    password = body.get("password")

    if not username or not email or not password:
        return JsonResponse(
            {"error": "username, email, and password are required"}, status=400
        )

    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email is already registered"}, status=400)

    user = User.objects.create(
        username=username, email=email, password_hash=make_password(password)
    )

    return JsonResponse({"message": "Registration successful", "user_id": user.id})


# 🔑 Login API
@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return JsonResponse({"error": "Email and password are required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "Invalid email or password"}, status=401)

    if not check_password(password, user.password_hash):
        return JsonResponse({"error": "Invalid email or password"}, status=401)

    # Generate a simple session token (stateless demo token)
    token = secrets.token_hex(32)

    return JsonResponse({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": user.username,
        }
    })


# 📊 Stats API
def stats(request):
    total = Transaction.objects.count()
    safe = Transaction.objects.filter(status="SAFE").count()
    fraud = Transaction.objects.filter(status="FRAUD").count()

    return JsonResponse({"total": total, "safe": safe, "fraud": fraud})


def transactions(request):
    data = list(Transaction.objects.values())
    return JsonResponse(data, safe=False)


def ml_data(request):
    data = list(
        MLTrainingDataIndia.objects.order_by("-transaction_date_time")[:200].values()
    )
    return JsonResponse(data, safe=False)


# 🏠 Home Landing Page
def index(request):
    html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CCFD Backend</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #0f172a;
            color: white;
            text-align: center;
            margin-top: 100px;
        }
        .box {
            background: #1e293b;
            padding: 20px;
            border-radius: 10px;
            display: inline-block;
        }
        a {
            display: inline-block;
            margin: 10px;
            padding: 10px 20px;
            text-decoration: none;
            color: white;
            background: #3b82f6;
            border-radius: 5px;
        }
        a:hover {
            background: #2563eb;
        }
    </style>
</head>
<body>

    <div class="box">
        <h1>CCFD Backend</h1>
        <a href="/admin/">Admin Panel</a>
        <a href="/static/index.html">CCFD Frontend</a>
    </div>

</body>
</html>
"""
    return HttpResponse(html)


@csrf_exempt
def add_transaction(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    required_fields = ["user_id", "amount", "status", "fraud_score"]
    missing = [field for field in required_fields if field not in body]
    if missing:
        return JsonResponse(
            {"error": f"Missing fields: {', '.join(missing)}"}, status=400
        )

    card_number_last4 = str(body.get("card_number", "0000"))[-4:]

    try:
        tx = Transaction.objects.create(
            user_id=body["user_id"],
            card_holder=body.get("card_holder", "Unknown"),
            card_number_last4=card_number_last4,
            expiry_date=body.get("expiry", "00/00"),
            amount=body["amount"],
            status=body["status"],
            fraud_score=body["fraud_score"],
        )
    except Exception as exc:
        return JsonResponse(
            {"error": "Failed to create transaction", "details": str(exc)}, status=400
        )

    return JsonResponse({"message": "Transaction added", "id": tx.id})


# ==========================================
# REAL-TIME FRAUD DETECTION APIs
# ==========================================

# Path to the models directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "..", "ml_model", "models")


@api_view(["POST"])
def predict_transaction(request):
    # Lazy import ML dependencies so app startup/migrations do not fail
    # when optional ML packages are missing in the environment.
    try:
        import joblib
        import numpy as np
    except ImportError:
        return Response(
            {
                "error": "ML dependencies are not installed. Please install joblib and numpy."
            },
            status=503,
        )

    data = request.data
    amount = float(data.get("amount", 0.0))
    user_id = data.get("user_id", 1)
    t_type = data.get("type", "Unknown")
    location = data.get("location", "Unknown")
    device = data.get("device", "Unknown")

    try:
        model_path = os.path.join(MODELS_DIR, "random_forest_model.pkl")
        scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")

        if not os.path.exists(model_path) or not os.path.exists(scaler_path):
            return Response(
                {
                    "error": "ML model files are not available. Please train the model and place the files in ml_model/models."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        # The model expects 29 features: V1-V28 and Amount.
        # We will pad V1-V28 with 0.0, and set the last feature to Amount.
        features = np.zeros(29)
        features[-1] = amount
        features_2d = features.reshape(1, -1)

        scaled_features = scaler.transform(features_2d)

        prediction = int(model.predict(scaled_features)[0])
        probability = float(model.predict_proba(scaled_features)[0][1])

        # ==========================================
        # BEHAVIORAL BACKGROUND CHECK (Expert Rule)
        # ==========================================
        from django.db.models import Max
        
        # Get historical max for this user from training data
        hist_max = MLTrainingDataIndia.objects.filter(user_id=user_id).aggregate(Max('transaction_amount'))['transaction_amount__max']
        
        # Heuristic: If amount is significantly higher than previous max, flag it
        is_behavioral_outlier = False
        if hist_max and amount > (float(hist_max) * 1.5):
            is_behavioral_outlier = True
            
        # Override if it's a massive outlier (e.g. > $10,000) or behavioral outlier
        is_fraud = prediction == 1 or probability > 0.6 or is_behavioral_outlier or amount > 10000
        
        if is_behavioral_outlier or amount > 10000:
            probability = max(probability, 0.95) # Boost probability for visibility
            
        status = "suspicious" if is_fraud else "safe"

    except Exception as e:
        print(f"Prediction Error: {e}")
        prediction = 0
        probability = 0.0
        status = "safe"

    # Find the verification amount (last successful transaction)
    # Search Live history first, then behavioral background
    prev = LiveTransaction.objects.filter(user_id=user_id, user_response='approved').order_by('-id').first()
    if not prev:
        prev = MLTrainingDataIndia.objects.filter(user_id=user_id).order_by('-transaction_date_time').first()
        if prev:
            # Handle field name difference
            prev.amount = prev.transaction_amount
            
    verification_amount = float(prev.amount) if prev else 100.00

    # Save to LiveTransaction
    tx = LiveTransaction.objects.create(
        user_id=user_id,
        amount=amount,
        transaction_type=t_type,
        location=location,
        device_type=device,
        prediction=1 if is_fraud else 0,
        probability=probability,
        status=status,
        user_response="pending",
    )

    return Response(
        {
            "transaction_id": tx.id,
            "prediction": tx.prediction,
            "probability": tx.probability,
            "status": tx.status,
            "verification_amount": verification_amount,
        }
    )


@api_view(["POST"])
def approve_transaction(request):
    tx_id = request.data.get("transaction_id")
    decision = request.data.get("decision")  # 'approved' or 'rejected'

    try:
        tx = LiveTransaction.objects.get(id=tx_id)
        tx.user_response = decision
        tx.save()
        return Response({"message": f"Transaction marked as {decision}"})
    except LiveTransaction.DoesNotExist:
        return Response({"error": "Transaction not found"}, status=404)


class LiveTransactionPagination(PageNumberPagination):
    page_size = 10


class LiveTransactionList(generics.ListAPIView):
    serializer_class = LiveTransactionSerializer
    pagination_class = LiveTransactionPagination

    def get_queryset(self):
        queryset = LiveTransaction.objects.all().order_by("-timestamp")

        # Simple query parameter filtering
        prediction = self.request.query_params.get("prediction")
        if prediction is not None:
            queryset = queryset.filter(prediction=prediction)

        status = self.request.query_params.get("status")
        if status is not None:
            queryset = queryset.filter(status=status)

        user_response = self.request.query_params.get("user_response")
        if user_response is not None:
            queryset = queryset.filter(user_response=user_response)

        return queryset


@api_view(["GET"])
def metrics(request):
    total = LiveTransaction.objects.count()
    fraud_detected = LiveTransaction.objects.filter(prediction=1).count()
    false_positives = LiveTransaction.objects.filter(
        prediction=1, user_response="approved"
    ).count()

    # Simple accuracy calculation vs user responses
    # If prediction was 1 and user rejected -> True Positive
    # If prediction was 0 and user approved -> True Negative
    # For now, just a dummy calculation or a simplified one:
    resolved_count = LiveTransaction.objects.filter(
        user_response__in=["approved", "rejected"]
    ).count()
    if resolved_count > 0:
        correct = (
            LiveTransaction.objects.filter(
                prediction=1, user_response="rejected"
            ).count()
            + LiveTransaction.objects.filter(
                prediction=0, user_response__in=["approved", "pending"]
            ).count()
        )
        acc = (correct / total) * 100 if total > 0 else 100
    else:
        acc = 100.0

    return Response(
        {
            "total_transactions": total,
            "fraud_detected": fraud_detected,
            "false_positives": false_positives,
            "accuracy": round(acc, 2),
        }
    )


# 🔍 Verify Last Transaction (3-option security check)
@api_view(["POST"])
def verify_last_transaction(request):
    """
    Accepts { transaction_id, amount } and checks if the submitted amount
    matches the last safe/approved transaction amount for that user.
    Returns { success: bool }.
    """
    tx_id = request.data.get("transaction_id")
    submitted_amount = request.data.get("amount")

    if not tx_id or submitted_amount is None:
        return Response({"error": "transaction_id and amount are required"}, status=400)

    try:
        tx = LiveTransaction.objects.get(id=tx_id)
    except LiveTransaction.DoesNotExist:
        return Response({"error": "Transaction not found"}, status=404)

    # 1. Search LiveTransaction history first
    previous_tx = (
        LiveTransaction.objects.filter(
            user_id=tx.user_id,
            user_response__in=["approved"],
            id__lt=tx_id,
        )
        .order_by("-id")
        .first()
    )

    # 2. If no live history, search Behavioral Background (MLTrainingDataIndia)
    if not previous_tx:
        previous_tx = (
            MLTrainingDataIndia.objects.filter(user_id=tx.user_id)
            .order_by("-transaction_date_time")
            .first()
        )
        # Convert model field name mismatch if necessary
        if previous_tx:
            previous_tx.amount = previous_tx.transaction_amount

    if not previous_tx:
        # No history at all — auto-pass verification
        return Response({"success": True, "message": "New user with no history — auto-verified"})

    try:
        correct = float(previous_tx.amount)
        given = float(submitted_amount)
        # Allow small floating-point tolerance
        match = abs(correct - given) < 0.05
    except (ValueError, TypeError):
        match = False

    return Response({"success": match})

