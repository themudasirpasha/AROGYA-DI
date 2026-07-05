"""
Pub/Sub subscriber for AROGYA-DI alerts.
Pulls pending alert messages and prints/processes them.
In production this would feed into a live notification 
system (WhatsApp, dashboard toast, etc).
"""

from google.cloud import pubsub_v1
import json

PROJECT_ID = "ameer-491011"
SUBSCRIPTION_ID = "arogya-alerts-sub"

subscriber = pubsub_v1.SubscriberClient()
subscription_path = subscriber.subscription_path(PROJECT_ID, SUBSCRIPTION_ID)


def pull_alerts(max_messages=10):
    response = subscriber.pull(
        request={"subscription": subscription_path, "max_messages": max_messages}
    )

    alerts = []
    ack_ids = []

    for received_message in response.received_messages:
        data = json.loads(received_message.message.data.decode("utf-8"))
        alerts.append(data)
        ack_ids.append(received_message.ack_id)

    if ack_ids:
        subscriber.acknowledge(
            request={"subscription": subscription_path, "ack_ids": ack_ids}
        )

    return alerts


if __name__ == "__main__":
    alerts = pull_alerts()
    if not alerts:
        print("No new alerts.")
    for alert in alerts:
        print(f"[{alert['severity'].upper()}] {alert['type']}: {alert['message']}")