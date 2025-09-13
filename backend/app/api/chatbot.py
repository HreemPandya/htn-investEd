from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def chatbot_reply(query: dict):
    return {"message": "Chatbot placeholder", "query": query}
