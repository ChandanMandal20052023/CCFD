from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card_holder = models.CharField(max_length=100, default='Unknown')
    card_number_last4 = models.CharField(max_length=4, default='0000')
    expiry_date = models.CharField(max_length=7, default='00/00') # MM/YY
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10)  # SAFE / FRAUD
    fraud_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.card_holder} - {self.amount} - {self.status}"


class MLTrainingData(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    card_number_last4 = models.CharField(max_length=4)
    transaction_amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=50)
    transaction_date_time = models.DateTimeField()
    location = models.CharField(max_length=100)
    is_fraud = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'ml_training_data'


class LiveTransaction(models.Model):
    user_id = models.IntegerField(default=1)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    device_type = models.CharField(max_length=50, default='Unknown')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    prediction = models.IntegerField(null=True, blank=True)
    probability = models.FloatField(null=True, blank=True)
    
    STATUS_CHOICES = [
        ('safe', 'Safe'),
        ('suspicious', 'Suspicious'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='safe')
    
    RESPONSE_CHOICES = [
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('pending', 'Pending'),
    ]
    user_response = models.CharField(max_length=20, choices=RESPONSE_CHOICES, default='pending')

    def __str__(self):
        return f"User {self.user_id} - ${self.amount} - {self.status}"