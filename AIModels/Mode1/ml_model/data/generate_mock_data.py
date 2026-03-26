import random
import pandas as pd
from faker import Faker
import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta
import os

fake = Faker()
Faker.seed(42)
random.seed(42)

# Configuration
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

def generate_normal_data(n):
    data = []
    transaction_types = ['Food', 'Shopping', 'Travel', 'Bills', 'Entertainment']
    for _ in range(n):
        user_id = random.randint(1, NUM_USERS)
        card_number = fake.credit_card_number()[-4:]
        
        # Consistent amounts
        t_type = random.choice(transaction_types)
        if t_type == 'Food': amount = round(random.uniform(5, 50), 2)
        elif t_type == 'Bills': amount = round(random.uniform(50, 200), 2)
        else: amount = round(random.uniform(10, 150), 2)
        
        # Time patterns: mostly day to evening
        start_date = datetime.now() - timedelta(days=180)
        td_days = random.randint(0, 180)
        td_hours = random.choice(range(7, 22))  # 7 AM to 10 PM
        td_mins = random.randint(0, 59)
        dt = start_date + timedelta(days=td_days, hours=td_hours, minutes=td_mins)
        
        location = fake.city()
        data.append([user_id, card_number, amount, t_type, dt, location, 0])
    return data

def generate_fraud_data(n):
    data = []
    transaction_types = ['Shopping', 'Travel', 'Transfer']
    for _ in range(n):
        user_id = random.randint(1, NUM_USERS)
        card_number = fake.credit_card_number()[-4:]
        
        # Sudden large amounts
        t_type = random.choice(transaction_types)
        amount = round(random.uniform(1000, 5000), 2)
        
        # Suspicious timing: late night
        start_date = datetime.now() - timedelta(days=180)
        td_days = random.randint(0, 180)
        td_hours = random.choice([0, 1, 2, 3, 4])  # Midnight to 4 AM
        td_mins = random.randint(0, 59)
        dt = start_date + timedelta(days=td_days, hours=td_hours, minutes=td_mins)
        
        location = fake.country() # unusual international or completely random distant location
        data.append([user_id, card_number, amount, t_type, dt, location, 1])
    return data

def main():
    print(f"Generating {NUM_NORMAL} normal and {NUM_FRAUD} fraudulent records...")
    data = generate_normal_data(NUM_NORMAL) + generate_fraud_data(NUM_FRAUD)
    
    # Shuffle the combined data
    random.shuffle(data)
    
    # Create DataFrame
    columns = ['user_id', 'card_number_last4', 'transaction_amount', 'transaction_type', 
               'transaction_date_time', 'location', 'is_fraud']
    df = pd.DataFrame(data, columns=columns)
    
    # Save to CSV
    csv_path = os.path.join(os.path.dirname(__file__), 'ml_training_data.csv')
    df.to_csv(csv_path, index=False)
    print(f"Saved {NUM_RECORDS} records to {csv_path}")

    # MySQL Insertion
    print("Connecting to MySQL Database...")
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create Table Schema
            cursor.execute("DROP TABLE IF EXISTS ml_training_data;")
            create_table_query = """
            CREATE TABLE ml_training_data (
                transaction_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                card_number_last4 VARCHAR(4),
                transaction_amount DECIMAL(10, 2),
                transaction_type VARCHAR(50),
                transaction_date_time DATETIME,
                location VARCHAR(100),
                is_fraud BOOLEAN
            );
            """
            cursor.execute(create_table_query)
            print("Created table `ml_training_data`.")
            
            # Insert Data
            insert_query = """
            INSERT INTO ml_training_data 
            (user_id, card_number_last4, transaction_amount, transaction_type, transaction_date_time, location, is_fraud)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            # Convert DF to list of tuples for insertion
            records_to_insert = [tuple(x) for x in df.to_numpy()]
            
            # Use executemany for bulk insert
            cursor.executemany(insert_query, records_to_insert)
            connection.commit()
            
            print(f"Successfully inserted {cursor.rowcount} records into MySQL table `ml_training_data`.")

    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed.")

if __name__ == "__main__":
    main()
