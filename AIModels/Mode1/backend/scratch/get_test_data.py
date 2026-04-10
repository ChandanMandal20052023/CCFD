import os
import django
import sys
from django.db.models import Max

# Setup Django
project_root = os.getcwd()
sys.path.append(project_root)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_backend.settings')
django.setup()

from api.models import MLTrainingDataIndia

uids = [73, 253, 9, 304, 482]
print("--- TEST DATA ---")
for u in uids:
    agg = MLTrainingDataIndia.objects.filter(user_id=u).aggregate(Max('transaction_amount'))
    m = agg['transaction_amount__max']
    last = MLTrainingDataIndia.objects.filter(user_id=u).order_by("-transaction_date_time").first()
    print(f"User {u}: Max={m}, Last={last.transaction_amount if last else 'None'}")
