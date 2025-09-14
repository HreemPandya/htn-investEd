from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import cohere
import os
import uuid
import json
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from app.services.video_generator import generate_financial_help_video

# Load environment variables
load_dotenv()

router = APIRouter()

# In-memory job status tracking
job_status_store = {}

def update_job_status(job_id: str, status: str, progress: int = 0, message: str = ""):
    """Update job status with detailed information"""
    job_status_store[job_id] = {
        "status": status,
        "progress": progress,
        "message": message,
        "updated_at": datetime.now().isoformat(),
        "video_ready": False,
        "voiceover_ready": False
    }
    
    # Also save to file for persistence
    job_dir = Path(f"/Users/aymanfouad/Desktop/htnv2/htn-investEd/backend/videos/{job_id}")
    job_dir.mkdir(parents=True, exist_ok=True)
    
    status_file = job_dir / "status.json"
    with open(status_file, 'w') as f:
        json.dump(job_status_store[job_id], f, indent=2)

def get_job_status(job_id: str) -> dict:
    """Get job status with fallback to file"""
    # Check in-memory first
    if job_id in job_status_store:
        return job_status_store[job_id]
    
    # Fallback to file
    status_file = Path(f"/Users/aymanfouad/Desktop/htnv2/htn-investEd/backend/videos/{job_id}/status.json")
    if status_file.exists():
        with open(status_file, 'r') as f:
            status = json.load(f)
            job_status_store[job_id] = status  # Cache it
            return status
    
    return {"status": "not_found", "progress": 0, "message": "Job not found"}

async def generate_video_with_tracking(text_content: str, job_id: str):
    """Wrapper function to generate video with status tracking"""
    try:
        update_job_status(job_id, "processing", 10, "Starting video generation...")
        
        # Call the actual video generation function
        video_path = generate_financial_help_video(text_content, job_id, update_job_status)
        
        if video_path:
            update_job_status(job_id, "completed", 100, "Video and voiceover generation completed successfully")
            
            # Update file readiness flags
            job_dir = Path(f"/Users/aymanfouad/Desktop/htnv2/htn-investEd/backend/videos/{job_id}")
            video_files = list(job_dir.glob("**/*.mp4"))
            voiceover_files = list(job_dir.glob("**/*.mp3"))
            
            current_status = get_job_status(job_id)
            current_status["video_ready"] = len(video_files) > 0
            current_status["voiceover_ready"] = len(voiceover_files) > 0
            job_status_store[job_id] = current_status
            
            # Save updated status
            status_file = job_dir / "status.json"
            with open(status_file, 'w') as f:
                json.dump(current_status, f, indent=2)
        else:
            update_job_status(job_id, "failed", 0, "Video generation failed")
            
    except Exception as e:
        update_job_status(job_id, "failed", 0, f"Error during generation: {str(e)}")

class QuestionRequest(BaseModel):
    question: str

class QuestionResponse(BaseModel):
    answer: str
    question: str
    job_id: str
    video_url: str = None
    voiceover_url: str = None
    generation_status: str = "initiated"
    estimated_completion_time: str = None

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
        
        # Initialize job status
        update_job_status(job_id, "initiated", 0, "Answer generated, queuing video generation...")
        
        # Generate video in background with tracking
        background_tasks.add_task(generate_video_with_tracking, answer, job_id)
        
        return QuestionResponse(
            question=request.question,
            answer=answer,
            job_id=job_id,
            video_url=f"/videos/{job_id}/video.mp4",  # This will be available once video is generated
            voiceover_url=f"/videos/{job_id}/voiceover.mp3",  # This will be available once voiceover is generated
            generation_status="initiated",
            estimated_completion_time="2-3 minutes"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@router.get("/video-status/{job_id}")
async def get_video_status(job_id: str):
    """Check detailed status of video generation for a given job ID"""
    
    # Get detailed job status
    status_info = get_job_status(job_id)
    
    video_dir = Path(f"/Users/aymanfouad/Desktop/htnv2/htn-investEd/backend/videos/{job_id}")
    
    if not video_dir.exists():
        return {"status": "not_found", "message": "Job ID not found", "progress": 0}
    
    # Look for video files
    video_files = list(video_dir.glob("**/*.mp4"))
    voiceover_files = list(video_dir.glob("**/*.mp3"))
    
    # Build comprehensive response
    response = {
        "job_id": job_id,
        "status": status_info.get("status", "unknown"),
        "progress": status_info.get("progress", 0),
        "message": status_info.get("message", ""),
        "updated_at": status_info.get("updated_at", ""),
        "video_ready": status_info.get("video_ready", False),
        "voiceover_ready": status_info.get("voiceover_ready", False),
        "files": {
            "video": None,
            "voiceover": None
        }
    }
    
    # Add video file info if available
    if video_files:
        video_path = video_files[0]
        response["files"]["video"] = {
            "url": f"/videos/{job_id}/{video_path.name}",
            "file_size": video_path.stat().st_size,
            "file_name": video_path.name
        }
        response["video_ready"] = True
    
    # Add voiceover file info if available
    if voiceover_files:
        voiceover_path = voiceover_files[0]
        response["files"]["voiceover"] = {
            "url": f"/videos/{job_id}/{voiceover_path.name}",
            "file_size": voiceover_path.stat().st_size,
            "file_name": voiceover_path.name
        }
        response["voiceover_ready"] = True
    
    return response

@router.get("/jobs")
async def get_all_jobs():
    """Get status of all jobs for debugging"""
    return {
        "jobs": job_status_store,
        "total_jobs": len(job_status_store)
    }

@router.get("/health")
async def health_check():
    """Health check endpoint for the financial help service"""
    return {"status": "ok", "service": "financial_help"}