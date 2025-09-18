import os, uuid, tempfile, time
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cohere
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ---------- App & deps ----------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

co_client = cohere.Client(os.environ["COHERE_API_KEY"])

DB = {}  # job_id -> dict with status, url, error, timings, meta

class GenerateReq(BaseModel):
    prompt: str
    style: str | None = "friendly"
    duration_sec: int | None = 18  # keep short to stay <30s total

class ChatReq(BaseModel):
    message: str
    videoScript: str | None = None
    context: str | None = "investment_education"

# ---------- LLM step ----------
def cohere_script(prompt: str, style: str) -> str:
    resp = co_client.generate(
        model="command",
        prompt=(
            f"Write a concise, {style} 5-6 sentence voiceover script for a short educational video.\n"
            f"Topic: {prompt}\n"
            "Plain language. No markdown, no emojis."
        ),
        max_tokens=240,
        temperature=0.4,
    )
    return resp.generations[0].text.strip()

# ---------- Chat function ----------
def cohere_chat(message: str, video_script: str = None, context: str = "investment_education") -> str:
    # Build context-aware prompt
    prompt = f"You are a helpful investment education assistant. "
    
    if video_script:
        prompt += f"Based on this video script: '{video_script}', "
    
    prompt += f"Answer this question about {context}: {message}\n\n"
    prompt += "Provide helpful, accurate, and educational advice. Keep responses concise but informative."
    
    resp = co_client.generate(
        model="command",
        prompt=prompt,
        max_tokens=300,
        temperature=0.7,
    )
    return resp.generations[0].text.strip()

# ---------- Simple Video Creation (No FFmpeg/Manim) ----------
def create_simple_video(script: str, dur: int) -> str:
    """Create a simple video file - for demo purposes, we'll create a placeholder"""
    # Create a temporary directory
    media_dir = tempfile.mkdtemp()
    
    # For demo purposes, create a simple text file that represents our video
    # In a real implementation, you could use libraries like moviepy or create HTML5 videos
    video_path = os.path.join(media_dir, "video.txt")
    
    with open(video_path, "w") as f:
        f.write(f"VIDEO CONTENT\n")
        f.write(f"Script: {script}\n")
        f.write(f"Duration: {dur} seconds\n")
        f.write(f"This is a placeholder video file.\n")
        f.write(f"In a real implementation, this would be an actual MP4 file.\n")
    
    return video_path

# ---------- Use Local Video File ----------
def get_local_video_url() -> str:
    """Return the local test video URL instead of uploading to Supabase"""
    # Use the existing test video file
    return "http://localhost:3000/videos/test-video.mp4"

def now_ms(): return int(time.time() * 1000)

# ---------- Pipeline ----------
def pipeline(job_id: str, req: GenerateReq):
    t0 = now_ms()
    DB[job_id].update({"status": "generating", "timings": {"t0_start": t0}})
    try:
        # 1) LLM
        script = cohere_script(req.prompt, req.style or "friendly")
        t1 = now_ms()

        # 2) Create Video
        DB[job_id]["status"] = "rendering"
        video_path = create_simple_video(script, req.duration_sec or 18)
        t2 = now_ms()

        # 3) Get Local Video URL
        DB[job_id]["status"] = "uploading"
        url = get_local_video_url()
        t3 = now_ms()

        DB[job_id].update({
            "status": "ready",
            "url": url,
            "meta": {"script": script},
            "timings": {
                "t0_start": t0, "t1_llm": t1, "t2_render": t2, "t3_upload": t3,
                "llm_ms": t1 - t0, "render_ms": t2 - t1, "upload_ms": t3 - t2,
                "total_ms": t3 - t0
            }
        })
    except Exception as e:
        DB[job_id].update({"status": "error", "error": str(e)})

# ---------- Endpoints ----------
@app.post("/videos")
def create_video(req: GenerateReq, bg: BackgroundTasks):
    job_id = str(uuid.uuid4())
    DB[job_id] = {"status": "queued", "url": None, "error": None, "meta": None}
    bg.add_task(pipeline, job_id, req)
    return {"id": job_id, "status": "queued"}

@app.get("/videos/{job_id}")
def get_video(job_id: str):
    return DB.get(job_id, {"status": "error", "error": "not found"})

@app.post("/chat")
def chat(req: ChatReq):
    try:
        response = cohere_chat(req.message, req.videoScript, req.context)
        return {"response": response}
    except Exception as e:
        return {"error": str(e), "response": "I'm sorry, I'm having trouble responding right now."}

@app.get("/")
def root():
    return {"message": "AI Video Backend is running!"}
