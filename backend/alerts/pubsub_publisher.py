from google.cloud import pubsub_v1
import json

PROJECT_ID = "ameer-491011"
TOPIC_ID = "arogya-alerts"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(PROJECT_ID, TOPIC_ID)

def publish_alert(alert_type, message, severity="high"):
    data = json.dumps({
        "type": alert_type,
        "message": message,
        "severity": severity
    }).encode("utf-8")
    
    future = publisher.publish(topic_path, data)
    print(f"Published alert, message ID: {future.result()}")

if __name__ == "__main__":
    publish_alert(
        "anomaly", 
        "Dengue cases in Ward 12 are 3x above seasonal baseline", 
        "high"
    )
