from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def classify_transaction(transaction: dict):
    return {"message": "Classifier placeholder", "input": transaction}
