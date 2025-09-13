from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.utils.schemas import Transaction
from app.core.database import SessionLocal
from app.services import transaction_crud
from app.models.transaction_db import TransactionDB

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=Transaction)
async def create_transaction(txn: Transaction, db: Session = Depends(get_db)):
    return transaction_crud.create_transaction(db, txn)

@router.get("/", response_model=List[Transaction])
async def list_transactions(user_id: str, db: Session = Depends(get_db)):
    return transaction_crud.get_transactions(db, user_id)

# Debug endpoint to see raw DB rows
@router.get("/all_raw")
async def all_raw(db: Session = Depends(get_db)):
    rows = db.query(TransactionDB).all()
    return [row.__dict__ for row in rows]  # convert SQLAlchemy objects to dicts