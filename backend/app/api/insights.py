from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import SessionLocal
from app.services import transaction_crud
from app.utils.schemas import Transaction
from app.models.classifier import classify

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
async def get_insights(user_id: str, db: Session = Depends(get_db)):
    user_txns = transaction_crud.get_transactions(db, user_id)
    if not user_txns:
        return {"user_id": user_id, "insight": "No transactions found yet."}

    unnecessary_total = 0.0
    for txn in user_txns:
        schema_txn = Transaction.from_orm(txn)
        if classify(schema_txn) == "unnecessary":
            unnecessary_total += schema_txn.amount

    return {
        "user_id": user_id,
        "unnecessary_total": unnecessary_total,
        "transactions_count": len(user_txns),
        "insight": f"You spent ${unnecessary_total:.2f} on non-essentials last month. "
                   f"That could cover half a new laptop payment! 💻"
    }
