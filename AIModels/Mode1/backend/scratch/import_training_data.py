import os
import django
import csv
from datetime import datetime

# Setup Django environment
import sys
# Project root is the parent of this scratch directory
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_backend.settings')
django.setup()

from api.models import MLTrainingDataIndia

CSV_PATH = os.path.join(project_root, '..', 'ml_model', 'data', 'ml_training_data_india.csv')

def import_data():
    if not os.path.exists(CSV_PATH):
        print(f"Error: CSV not found at {CSV_PATH}")
        return

    print("Deleting existing records...")
    MLTrainingDataIndia.objects.all().delete()

    records = []
    print("Reading CSV...")
    with open(CSV_PATH, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(MLTrainingDataIndia(
                user_id=int(row['user_id']),
                card_number_last4=row['card_number_last4'],
                transaction_amount=float(row['transaction_amount']),
                transaction_type=row['transaction_type'],
                transaction_date_time=row['transaction_date_time'],
                location=row['location'],
                is_fraud=row['is_fraud'] == '1'
            ))

    print(f"Importing {len(records)} records...")
    MLTrainingDataIndia.objects.bulk_create(records, batch_size=1000)
    print("Import complete!")

if __name__ == "__main__":
    import_data()
