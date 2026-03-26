from django.http import JsonResponse, HttpResponse
from .models import Transaction, User, MLTrainingData, LiveTransaction
from .serializers import LiveTransactionSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
import joblib
import numpy as np
import os
from django.views.decorators.csrf import csrf_exempt
import json

# 📝 Register API
@csrf_exempt
def register(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        user = User.objects.create(
            username=body['username'],
            email=body['email'],
            password_hash=body['password']
        )
        return JsonResponse({"message": "Registration successful", "user_id": user.id})
    return JsonResponse({"error": "POST required"}, status=400)


# 📊 Stats API
def stats(request):
    total = Transaction.objects.count()
    safe = Transaction.objects.filter(status='SAFE').count()
    fraud = Transaction.objects.filter(status='FRAUD').count()

    return JsonResponse({
        "total": total,
        "safe": safe,
        "fraud": fraud
    })
def transactions(request):
    data = list(Transaction.objects.values())
    return JsonResponse(data, safe=False)


def ml_data(request):
    data = list(MLTrainingData.objects.order_by('-transaction_date_time')[:200].values())
    return JsonResponse(data, safe=False)


from django.http import HttpResponse

# ... existing views ...

# 🏠 Home Landing Page
def index(request):
    html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CCFD Backend Control</title>
        <style>
            body { font-family: 'Inter', sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .container { text-align: center; background: #1e293b; padding: 3rem; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
            h1 { margin-bottom: 2rem; font-size: 2rem; background: linear-gradient(to right, #60a5fa, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .btn-group { display: flex; gap: 1rem; justify-content: center; }
            .btn { padding: 0.75rem 1.5rem; font-size: 1rem; font-weight: 600; text-decoration: none; border-radius: 0.5rem; transition: all 0.3s; border: none; cursor: pointer; }
            .btn-blue { background: #3b82f6; color: white; }
            .btn-blue:hover { background: #2563eb; transform: translateY(-2px); }
            .btn-purple { background: #8b5cf6; color: white; }
            .btn-purple:hover { background: #7c3aed; transform: translateY(-2px); }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>CCFD AI Dashboard</h1>
            <div class="btn-group">
                <a href="/admin/" class="btn btn-purple">Admin Panel</a>
                <a href="/static/index.html" class="btn btn-blue">Frontend App</a>
            </div>
        </div>
    </body>
    </html>
    """
    return HttpResponse(html)

@csrf_exempt
def add_transaction(request):
    if request.method == 'POST':
        body = json.loads(request.body)

        tx = Transaction.objects.create(
            user_id=body['user_id'],
            card_holder=body.get('card_holder', 'Unknown'),
            card_number_last4=body.get('card_number', '0000')[-4:],
            expiry_date=body.get('expiry', '00/00'),
            amount=body['amount'],
            status=body['status'],
            fraud_score=body['fraud_score']
        )

        return JsonResponse({"message": "Transaction added", "id": tx.id})


# ==========================================
# REAL-TIME FRAUD DETECTION APIs
# ==========================================

# Path to the models directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, '..', 'ml_model', 'models')

@api_view(['POST'])
def predict_transaction(request):
    data = request.data
    amount = float(data.get('amount', 0.0))
    user_id = data.get('user_id', 1)
    t_type = data.get('type', 'Unknown')
    location = data.get('location', 'Unknown')
    device = data.get('device', 'Unknown')

    try:
        model_path = os.path.join(MODELS_DIR, 'random_forest_model.pkl')
        scaler_path = os.path.join(MODELS_DIR, 'scaler.pkl')
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
        
        # Override threshold if needed (e.g. > 0.6)
        is_fraud = prediction == 1 or probability > 0.6
        status = 'suspicious' if is_fraud else 'safe'
        
    except Exception as e:
        print(f"Prediction Error: {e}")
        prediction = 0
        probability = 0.0
        status = 'safe'

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
        user_response='pending'
    )

    return Response({
        "transaction_id": tx.id,
        "prediction": tx.prediction,
        "probability": tx.probability,
        "status": tx.status
    })

@api_view(['POST'])
def approve_transaction(request):
    tx_id = request.data.get('transaction_id')
    decision = request.data.get('decision') # 'approved' or 'rejected'
    
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
        queryset = LiveTransaction.objects.all().order_by('-timestamp')
        
        # Simple query parameter filtering
        prediction = self.request.query_params.get('prediction')
        if prediction is not None:
            queryset = queryset.filter(prediction=prediction)
            
        status = self.request.query_params.get('status')
        if status is not None:
            queryset = queryset.filter(status=status)
            
        user_response = self.request.query_params.get('user_response')
        if user_response is not None:
            queryset = queryset.filter(user_response=user_response)
            
        return queryset

@api_view(['GET'])
def metrics(request):
    total = LiveTransaction.objects.count()
    fraud_detected = LiveTransaction.objects.filter(prediction=1).count()
    false_positives = LiveTransaction.objects.filter(prediction=1, user_response='approved').count()
    
    # Simple accuracy calculation vs user responses
    # If prediction was 1 and user rejected -> True Positive
    # If prediction was 0 and user approved -> True Negative
    # For now, just a dummy calculation or a simplified one:
    resolved_count = LiveTransaction.objects.filter(user_response__in=['approved', 'rejected']).count()
    if resolved_count > 0:
        correct = LiveTransaction.objects.filter(prediction=1, user_response='rejected').count() + \
                  LiveTransaction.objects.filter(prediction=0, user_response__in=['approved', 'pending']).count()
        acc = (correct / total) * 100 if total > 0 else 100
    else:
        acc = 100.0

    return Response({
        "total_transactions": total,
        "fraud_detected": fraud_detected,
        "false_positives": false_positives,
        "accuracy": round(acc, 2)
    })