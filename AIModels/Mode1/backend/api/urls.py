from django.urls import path
from .views import (
    stats, transactions, add_transaction, register, login,
    ml_data, predict_transaction, approve_transaction,
    verify_last_transaction, LiveTransactionList, metrics
)

urlpatterns = [
    path('stats/', stats, name='stats'),
    path('transactions/', transactions, name='transactions'),
    path('add/', add_transaction, name='add-transaction'),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('ml-data/', ml_data, name='ml-data'),
    path('predict-transaction/', predict_transaction, name='predict'),
    path('approve-transaction/', approve_transaction, name='approve'),
    path('verify-last-transaction/', verify_last_transaction, name='verify'),
    path('live-transactions/', LiveTransactionList.as_view(), name='live-list'),
    path('metrics/', metrics, name='metrics'),
]
