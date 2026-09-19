
from sklearn.ensemble import IsolationForest
import json
import sys
import random

# ---------------------------------------------------------
# NORMAL TRANSACTION TRAINING DATA
# ---------------------------------------------------------
# Features:
# [amount, hour, velocity, location_change]
#
# These represent a broad range of normal banking behavior.

random.seed(42)

normal_data = []

for _ in range(500):
    amount = random.randint(500, 10000)
    hour = random.randint(7, 22)
    velocity = random.randint(1, 3)
    location_change = 0

    normal_data.append([
        amount,
        hour,
        velocity,
        location_change
    ])


# ---------------------------------------------------------
# ISOLATION FOREST MODEL
# ---------------------------------------------------------

model = IsolationForest(
    n_estimators=200,
    contamination=0.05,
    random_state=42
)

model.fit(normal_data)


# ---------------------------------------------------------
# ANOMALY DETECTION
# ---------------------------------------------------------

def detect_anomaly(transaction):
    """
    Detect whether a transaction is anomalous.

    Features:
    - amount
    - hour
    - velocity
    - location change

    Returns:
        anomaly: True / False
        anomalyScore: Isolation Forest decision score
    """

    amount = transaction["amount"]

    hour = transaction.get("hour", 12)

    velocity = transaction.get("velocity", 1)

    location_change = transaction.get("locationChange", 0)

    features = [[
        amount,
        hour,
        velocity,
        location_change
    ]]

    prediction = model.predict(features)[0]

    score = model.decision_function(features)[0]

    return {
        "anomaly": bool(prediction == -1),
        "anomalyScore": round(float(score), 4)
    }


# ---------------------------------------------------------
# DIRECT PYTHON TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    test_transactions = [
        {
            "transactionId": "TX_NORMAL",
            "amount": 2000,
            "hour": 14,
            "velocity": 1,
            "locationChange": 0
        },
        {
            "transactionId": "TX_SUSPICIOUS",
            "amount": 50000,
            "hour": 2,
            "velocity": 8,
            "locationChange": 1
        }
    ]

    print("\n===== ISOLATION FOREST TEST =====\n")

    for transaction in test_transactions:

        result = detect_anomaly(transaction)

        print(
            json.dumps(
                {
                    "transactionId": transaction["transactionId"],
                    **result
                },
                indent=2
            )
        )


# ---------------------------------------------------------
# NODE.JS BRIDGE INPUT
# ---------------------------------------------------------

if len(sys.argv) > 1:

    transaction = json.loads(sys.argv[1])

    result = detect_anomaly(transaction)

    print(json.dumps(result))

