import random
import pandas as pd
from faker import Faker
import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta
import os

# Setup
fake = Faker('en_IN')
Faker.seed(42)
random.seed(42)

NUM_RECORDS = 10000
NUM_FRAUD = 500
NUM_NORMAL = NUM_RECORDS - NUM_FRAUD
NUM_USERS = 500

DB_CONFIG = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'Palamua##77889',
    'database': 'ccfd_db',
    'port': 3306
}

# Indian context
indian_cities = [
    "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Jaipur", "Lucknow", "Ahmedabad"
]

transaction_types = [
    'Credit Card', 'Wallet', 'Entertainment',
    'Bill Payment', 'Online Shopping', 'Food & Dining'
]

# -----------------------------
# NORMAL DATA
# -----------------------------
def generate_normal_data(n):
    data = []
    for _ in range(n):
        user_id = random.randint(1, NUM_USERS)
        card_number = fake.credit_card_number()[-4:]
        t_type = random.choice(transaction_types)

        # Normal spending ₹
        if t_type == 'Food':
            amount = round(random.uniform(100, 800), 2)
        elif t_type == 'Bill Payment':
            amount = round(random.uniform(500, 3000), 2)
        elif t_type == 'Shopping':
            amount = round(random.uniform(500, 8000), 2)
        else:
            amount = round(random.uniform(100, 10000), 2)

        # Time
        start_date = datetime.now() - timedelta(days=180)
        dt = start_date + timedelta(
            days=random.randint(0, 180),
            hours=random.randint(7, 23),
            minutes=random.randint(0, 59)
        )

        location = random.choice(indian_cities)

        # ML Features
        hour = dt.hour
        is_night = 1 if hour < 5 else 0
        is_high_amount = 1 if amount > 20000 else 0

        data.append([
            user_id, card_number, amount, t_type, dt,
            location, hour, is_night, is_high_amount, 0
        ])

    return data

# -----------------------------
# FRAUD DATA
# -----------------------------
def generate_fraud_data(n):
    data = []
    for _ in range(n):
        user_id = random.randint(1, NUM_USERS)
        card_number = fake.credit_card_number()[-4:]
        t_type = random.choice(['Credit Card', 'Net Banking'])

        amount = round(random.uniform(20000, 150000), 2)

        start_date = datetime.now() - timedelta(days=180)
        dt = start_date + timedelta(
            days=random.randint(0, 180),
            hours=random.choice([0, 1, 2, 3, 4]),
            minutes=random.randint(0, 59)
        )

        location = fake.country()

        # ML Features
        hour = dt.hour
        is_night = 1
        is_high_amount = 1

        data.append([
            user_id, card_number, amount, t_type, dt,
            location, hour, is_night, is_high_amount, 1
        ])

    return data

# -----------------------------
# MAIN
# -----------------------------
def main():
    print("Generating data...")

    data = generate_normal_data(NUM_NORMAL) + generate_fraud_data(NUM_FRAUD)
    random.shuffle(data)

    columns = [
        'user_id', 'card_number_last4', 'transaction_amount',
        'transaction_type', 'transaction_date_time', 'location',
        'hour', 'is_night', 'is_high_amount', 'is_fraud'
    ]

    df = pd.DataFrame(data, columns=columns)

    # ---------------- CSV SAVE ----------------
    csv_path = os.path.join(os.getcwd(), 'ml_training_data_india.csv')
    df.to_csv(csv_path, index=False)
    print(f"CSV saved at: {csv_path}")

    # ---------------- MYSQL ----------------
    try:
        connection = mysql.connector.connect(**DB_CONFIG)

        if connection.is_connected():
            cursor = connection.cursor()

            cursor.execute("DROP TABLE IF EXISTS ml_training_data;")

            cursor.execute("""
            CREATE TABLE ml_training_data (
                transaction_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                card_number_last4 VARCHAR(4),
                transaction_amount DECIMAL(10,2),
                transaction_type VARCHAR(50),
                transaction_date_time DATETIME,
                location VARCHAR(100),
                hour INT,
                is_night BOOLEAN,
                is_high_amount BOOLEAN,
                is_fraud BOOLEAN
            );
            """)

            insert_query = """
            INSERT INTO ml_training_data
            (user_id, card_number_last4, transaction_amount, transaction_type,
             transaction_date_time, location, hour, is_night, is_high_amount, is_fraud)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            cursor.executemany(insert_query, df.values.tolist())
            connection.commit()

            print(f"{cursor.rowcount} records inserted into MySQL.")

    except Error as e:
        print("MySQL Error:", e)

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection closed.")

if __name__ == "__main__":
    main()