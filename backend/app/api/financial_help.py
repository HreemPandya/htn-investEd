from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import cohere
import os
import uuid
from dotenv import load_dotenv
from app.services.video_generator import generate_financial_help_video

# Load environment variables
load_dotenv()

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

class QuestionResponse(BaseModel):
    answer: str
    question: str
    job_id: str
    video_url: str = None

@router.post("/", response_model=QuestionResponse)
async def get_financial_help(request: QuestionRequest, background_tasks: BackgroundTasks):
    """
    Get easy-to-understand financial/investing help using Cohere's LLM.
    Takes a financial question and returns a simple, clear explanation with an animated video.
    """
    try:
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        
        # Get Cohere API key from environment
        api_key = os.getenv("COHERE_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Cohere API key not found in environment variables")
        
        # Initialize Cohere client
        co = cohere.Client(api_key)
        
        # Create a prompt for financial help
        prompt = f"""You are a helpful financial advisor. Please provide a clear, easy-to-understand explanation for the following financial/investing question. Keep your answer concise (2-3 sentences) and use simple language that anyone can understand.

Question: {request.question}

Answer:"""
        
        # Generate response using Cohere
        response = co.generate(
            model='command',
            prompt=prompt,
            max_tokens=150,
            temperature=0.3,
            stop_sequences=["Question:", "Answer:"]
        )
        
        # Extract the generated text
        answer = response.generations[0].text.strip()
        
        # Generate video in background
        background_tasks.add_task(generate_financial_help_video, answer, job_id)
        
        return QuestionResponse(
            question=request.question,
            answer=answer,
            job_id=job_id,
            video_url=f"/videos/{job_id}/video.mp4"  # This will be available once video is generated
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@router.get("/video-status/{job_id}")
async def get_video_status(job_id: str):
    """Check if video is ready for a given job ID"""
    import os
    from pathlib import Path
    
    video_dir = Path(f"/Users/aymanfouad/Desktop/htnv2/htn-investEd/backend/videos/{job_id}")
    
    if not video_dir.exists():
        return {"status": "not_found", "message": "Job ID not found"}
    
    # Look for video files
    video_files = list(video_dir.glob("**/*.mp4"))
    
    if video_files:
        video_path = video_files[0]
        return {
            "status": "ready",
            "video_url": f"/videos/{job_id}/{video_path.name}",
            "file_size": video_path.stat().st_size
        }
    else:
        return {"status": "processing", "message": "Video is still being generated"}

@router.get("/health")
async def health_check():
    """Health check endpoint for the financial help service"""
    return {"status": "ok", "service": "financial_help"}
