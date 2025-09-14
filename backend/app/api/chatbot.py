from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import cohere
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/", response_model=ChatResponse)
async def chatbot_reply(request: ChatRequest):
    """
    Get financial advice using Cohere's LLM with a focus on young audiences.
    """
    try:
        # Get Cohere API key from environment
        api_key = os.getenv("COHERE_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Cohere API key not found in environment variables")
        
        # Initialize Cohere client
        co = cohere.Client(api_key)
        
        # Generate response using Cohere
        response = co.generate(
            model='command',
            prompt=request.message,
            max_tokens=200,
            temperature=0.7,
            stop_sequences=["User question:", "Answer:"]
        )
        
        # Extract the generated text
        answer = response.generations[0].text.strip()
        
        return ChatResponse(response=answer)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")
