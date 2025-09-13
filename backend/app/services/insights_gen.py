from typing import List
from app.utils.schemas import Transaction
from app.models.classifier import classify

def generate_insight(user_id: str, transactions: List) -> dict:
    unnecessary_total = 0.0

    for txn in transactions:
        # normalize SQLAlchemy object into Pydantic Transaction
        schema_txn = Transaction.from_orm(txn)
        label = classify(schema_txn)
        if label == "unnecessary":
            unnecessary_total += schema_txn.amount

    if unnecessary_total > 0:
        message = f"You spent ${unnecessary_total:.2f} on non-essentials last month."
        message += " That could cover half a new laptop payment! 💻"
    else:
        message = "Great job! You had no unnecessary spending last month. 🎉"

    return {
        "user_id": user_id,
        "unnecessary_total": unnecessary_total,
        "transactions_count": len(transactions),
        "insight": message
    }
