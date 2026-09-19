import csv
import sys
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

if len(sys.argv) < 2:
    print("Usage: python evaluateModel.py <dataset.csv>")
    sys.exit(1)

dataset_path = sys.argv[1]

y_true = []
y_pred = []

with open(dataset_path, "r", newline="", encoding="utf-8") as file:
    reader = csv.DictReader(file)

    for row in reader:
        # Public fraud datasets commonly use:
        # 0 = legitimate
        # 1 = fraud
        actual = int(row["Class"])

        # Simple evidence-based evaluation rule.
        # This is intentionally separate from the live simulator.
        amount = float(row.get("Amount", 0))

        predicted = 1 if amount >= 20000 else 0

        y_true.append(actual)
        y_pred.append(predicted)

precision = precision_score(
    y_true,
    y_pred,
    zero_division=0
)

recall = recall_score(
    y_true,
    y_pred,
    zero_division=0
)

f1 = f1_score(
    y_true,
    y_pred,
    zero_division=0
)

tn, fp, fn, tp = confusion_matrix(
    y_true,
    y_pred,
    labels=[0, 1]
).ravel()

fpr = fp / (fp + tn) if (fp + tn) else 0

print("\n===== FRAUD SHIELD OFFLINE EVALUATION =====\n")

print(f"Records evaluated : {len(y_true)}")
print(f"Precision          : {precision:.4f}")
print(f"Recall             : {recall:.4f}")
print(f"F1 Score           : {f1:.4f}")
print(f"False Positive Rate: {fpr:.4f}")

print("\nConfusion Matrix:")
print(f"TN: {tn}")
print(f"FP: {fp}")
print(f"FN: {fn}")
print(f"TP: {tp}")