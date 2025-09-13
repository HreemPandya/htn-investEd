from sqlalchemy.orm import Session
from app.models.transaction_db import TransactionDB
from app.utils.schemas import Transaction

def get_transactions(db: Session, user_id: str):
    results = db.query(TransactionDB).filter(TransactionDB.user_id == user_id).all() # debug stat
    print(f"[DEBUG] Found {len(results)} transactions for user_id={user_id}") # debug
    return results


def create_transaction(db: Session, txn: Transaction):
    db_txn = TransactionDB(
        user_id=txn.user_id,
        merchant=txn.merchant,
        amount=txn.amount,
        date=txn.date,
        description=txn.description,
        category=txn.category
    )
    db.add(db_txn)
    db.commit()
    db.refresh(db_txn)
    return db_txn
