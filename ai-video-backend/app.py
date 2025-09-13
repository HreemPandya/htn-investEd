import os
import uuid
import tempfile
import asyncio
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from typing import Dict

import cohere
from manim import Scene, Text, config
from supabase import create_client, Client

# ------------------------
# Config
# ------------------------
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "videos")

co = cohere.Client(COHERE_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Video jobs in memory (for demo; ideally use Redis/DB)
video_jobs: Dict[str, Dict] = {}

app = FastAPI()

# ------------------------
# Schemas
# ------------------------
class VideoRequest(BaseModel):
    prompt: str
    style: str = "friendly"
    duration_sec: int = 15

# ------------------------
# Helper Functions
# ------------------------
def generate_script_with_cohere(prompt: str, style: str) -> str:
    """Generate a script from Cohere based on insight prompt."""
    response = co.generate(
        model="command-xlarge-202401",
        prompt=f"Write a short, witty, {style} script narration for a {prompt}. Keep it under 5 sentences."
    )
    return response.generations[0].text.strip()

def render_manim_video(script: str, duration_sec: int) -> str:
    """Render a simple Manim video file from script text."""
    class ScriptScene(Scene):
        def construct(self):
            # You can customize this scene
            t = Text(script).scale(0.5)
            self.play(t.animate.scale(1.2))
            self.wait(duration_sec // 3)
    
    with tempfile.TemporaryDirectory() as tmpdir:
        config.media_dir = tmpdir
        config.video_dir = tmpdir
        config.output_file = "output.mp4"
        scene = ScriptScene()
        scene.render()
        video_path = os.path.join(tmpdir, "videos", "480p15", "output.mp4")
        return video_path

def upload_to_supabase(video_path: str, job_id: str) -> str:
    """Upload rendered video to Supabase and return public URL."""
    file_name = f"{job_id}.mp4"
    with open(video_path, "rb") as f:
        supabase.storage.from_(SUPABASE_BUCKET).upload(file_name, f, {"upsert": True})
    # Build public URL
    public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(file_name)
    return public_url

# ------------------------
# Background Job
# ------------------------
def process_video_job(job_id: str, prompt: str, style: str, duration_sec: int):
    try:
        video_jobs[job_id]["status"] = "processing"

        # 1. Script from Cohere
        script = generate_script_with_cohere(prompt, style)

        # 2. Render video with Manim
        video_path = render_manim_video(script, duration_sec)

        # 3. Upload to Supabase
        url = upload_to_supabase(video_path, job_id)

        # 4. Update job status
        video_jobs[job_id].update({
            "status": "ready",
            "url": url,
            "meta": {"script": script}
        })
    except Exception as e:
        video_jobs[job_id].update({
            "status": "failed",
            "error": str(e)
        })

# ------------------------
# API Endpoints
# ------------------------
@app.post("/videos")
def create_video(req: VideoRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    video_jobs[job_id] = {"status": "queued", "url": None, "meta": {}}

    # Start background task
    background_tasks.add_task(process_video_job, job_id, req.prompt, req.style, req.duration_sec)

    return {"id": job_id, "status": "queued"}

@app.get("/videos/{job_id}")
def get_video_status(job_id: str):
    job = video_jobs.get(job_id)
    if not job:
        return {"error": "job_id not found"}
    return {"id": job_id, **job}
