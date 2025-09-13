from fastapi import APIRouter
from app.utils.schemas import Transaction
from app.models.classifier import classify

router = APIRouter()

@router.post("/")
async def classify_transaction(txn: Transaction):
    label = classify(txn)
    return {
        "id": txn.id,
        "merchant": txn.merchant,
        "amount": txn.amount,
        "category": txn.category,
        "classification": label
    }
