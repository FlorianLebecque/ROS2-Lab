import os
import sqlite3
import csv
from rclpy.serialization import deserialize_message
from rosidl_runtime_py.utilities import get_message
import sys

def extract_bag_data_to_csv(bag_file, output_dir):
    # Open the SQLite3 database (ROS2 bag format is SQLite3)
    conn = sqlite3.connect(bag_file)
    cursor = conn.cursor()

    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, mode=0o777)

    # list all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    print(f"Tables: {tables}")

    # Fetch all topics from the bag
    cursor.execute("SELECT name, type FROM topics")
    topics = cursor.fetchall()

    for topic_name, topic_type in topics:
        print(f"Processing topic: {topic_name}, Type: {topic_type}")
        
        # Create CSV file for each topic
        csv_file_path = os.path.join(output_dir, f"{topic_name.replace('/', '_')}.csv")
        
        # Get the corresponding message type class from the type string
        msg_type = get_message(topic_type)

        # Fetch all messages associated with the topic
        cursor.execute(f"""
            SELECT timestamp, data FROM messages
            INNER JOIN topics ON messages.topic_id = topics.id
            WHERE topics.name = '{topic_name}'
        """)
        messages = cursor.fetchall()

        with open(csv_file_path, mode='w', newline='') as csv_file:
            writer = csv.writer(csv_file)
            
            # Write header row
            field_names = [field for field in msg_type.__slots__]
            writer.writerow(['timestamp'] + field_names)
            
            for timestamp, data in messages:
                # Deserialize message
                msg = deserialize_message(data, msg_type)
                
                # Extract values for CSV
                row = [timestamp]
                for field in msg_type.__slots__:
                    value = getattr(msg, field, None)
                    row.append(value)
                
                writer.writerow(row)

    conn.close()
    print(f"Data exported to {output_dir}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python bagToCSV.py <bag_file> <output_dir>")
        sys.exit(1)

    bag_file = sys.argv[1]
    output_dir = sys.argv[2]

    extract_bag_data_to_csv(bag_file, output_dir)