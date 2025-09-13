from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_transactions():
    return {"message": "Transactions endpoint placeholder"}
