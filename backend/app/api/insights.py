from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_insights():
    return {"message": "Insights endpoint placeholder"}
