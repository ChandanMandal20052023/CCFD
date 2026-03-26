from rest_framework import serializers
from .models import LiveTransaction

class LiveTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveTransaction
        fields = '__all__'
