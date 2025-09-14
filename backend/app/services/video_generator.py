import os
import uuid
import subprocess
import tempfile
from pathlib import Path
from manim import *
import elevenlabs
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def merge_video_with_audio(video_path: str, audio_path: str, job_id: str, status_callback=None) -> str:
    """
    Merge video with audio using ffmpeg.
    
    Args:
        video_path: Path to the video file
        audio_path: Path to the audio file
        job_id: Unique identifier for the job
        status_callback: Optional callback function to update job status
    
    Returns:
        Path to the merged video file
    """
    def update_status(status, progress, message):
        if status_callback:
            status_callback(job_id, status, progress, message)
        print(f"[{job_id}] {progress}% - {message}")
    
    try:
        # Create paths
        video_file = Path(video_path)
        audio_file = Path(audio_path)
        job_dir = Path(f"/Users/aymanfouad/Desktop/htnv2/htn-investEd/backend/videos/{job_id}")
        merged_video_path = job_dir / "final_video.mp4"
        
        if not video_file.exists():
            raise Exception(f"Video file not found: {video_path}")
        if not audio_file.exists():
            raise Exception(f"Audio file not found: {audio_path}")
        
        update_status("processing", 96, "Starting video and audio merging...")
        
        # ffmpeg command to merge video and audio
        cmd = [
            "ffmpeg",
            "-i", str(video_file),     # Input video
            "-i", str(audio_file),     # Input audio
            "-c:v", "copy",            # Copy video codec (no re-encoding)
            "-c:a", "aac",             # Use AAC audio codec
            "-map", "0:v:0",           # Map first video stream
            "-map", "1:a:0",           # Map first audio stream
            "-shortest",               # End when shortest stream ends
            "-y",                      # Overwrite output file
            str(merged_video_path)
        ]
        
        # Run ffmpeg
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            raise Exception(f"FFmpeg failed: {result.stderr}")
        
        if not merged_video_path.exists():
            raise Exception("Merged video file was not created")
        
        update_status("processing", 98, f"Video merged successfully: {merged_video_path}")
        return str(merged_video_path)
        
    except Exception as e:
        update_status("failed", 0, f"Video merging failed: {str(e)}")
        raise Exception(f"Video merging failed: {str(e)}")

def generate_voiceover(text_content: str, job_id: str) -> str:
    """
    Generate voiceover using ElevenLabs API.
    
    Args:
        text_content: The text to convert to speech
        job_id: Unique identifier for the job
    
    Returns:
        Path to the generated audio file
    """
    try:
        # Get ElevenLabs credentials from environment
        api_key = os.getenv("ELEVENLABS_API_KEY")
        voice_id = os.getenv("ELEVENLABS_VOICE_ID")
        
        if not api_key or not voice_id:
            raise Exception("ElevenLabs API key or Voice ID not found in environment variables")
        
        # Create job directory if it doesn't exist
        job_dir = Path(f"/Users/aymanfouad/Desktop/htnv2/htn-investEd/backend/videos/{job_id}")
        job_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize ElevenLabs client
        client = elevenlabs.ElevenLabs(api_key=api_key)
        
        # Generate audio using ElevenLabs
        audio = client.text_to_speech.convert(
            voice_id=voice_id,
            text=text_content,
            model_id="eleven_monolingual_v1"  # You can change this to other models if needed
        )
        
        # Save the audio file
        audio_file_path = job_dir / "voiceover.mp3"
        
        # Save audio to file
        with open(audio_file_path, "wb") as f:
            for chunk in audio:
                f.write(chunk)
        
        return str(audio_file_path)
        
    except Exception as e:
        print(f"Error generating voiceover: {str(e)}")
        # Return empty string if voiceover generation fails - video will still work
        return ""

# Old scene class removed - using the improved version in generate_financial_help_video function

def generate_financial_help_video(text_content: str, job_id: str, status_callback=None) -> str:
    """
    Generate a Manim video for financial help text content.
    
    Args:
        text_content: The financial help text to animate
        job_id: Unique identifier for the job/video
        status_callback: Optional callback function to update job status
    
    Returns:
        Path to the generated video file
    """
    def update_status(status, progress, message):
        if status_callback:
            status_callback(job_id, status, progress, message)
        print(f"[{job_id}] {progress}% - {message}")
    
    # Create job directory
    job_dir = Path(f"/Users/aymanfouad/Desktop/htnv2/htn-investEd/backend/videos/{job_id}")
    job_dir.mkdir(parents=True, exist_ok=True)
    
    update_status("processing", 20, "Created job directory, preparing scene...")
    
    # Create temporary scene file with CSS grid-like layout
    scene_content = f'''from manim import *
import sys
import os
import re

class FinancialHelpScene(Scene):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.text_content = """{text_content}"""
    
    def chunk_text(self, text, max_chars_per_chunk=150):
        """Split text into logical chunks based on sentences and length"""
        # Split by sentences first
        sentences = re.split(r'(?<=[.!?])\\s+', text)
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            # If adding this sentence would exceed max length, start new chunk
            if len(current_chunk + " " + sentence) > max_chars_per_chunk and current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = sentence
            else:
                current_chunk += " " + sentence if current_chunk else sentence
        
        # Add the last chunk if it exists
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def create_grid_text_chunks(self, text, max_width=35, max_lines_per_chunk=3):
        """Create multiple text chunks that fit within grid cells with proper line wrapping"""
        words = text.split()
        lines = []
        current_line = ""
        
        # First, create all lines
        for word in words:
            if len(current_line + " " + word) <= max_width:
                current_line += " " + word if current_line else word
            else:
                if current_line:
                    lines.append(current_line)
                current_line = word
        
        if current_line:
            lines.append(current_line)
        
        # Now split lines into chunks of max_lines_per_chunk
        chunks = []
        for i in range(0, len(lines), max_lines_per_chunk):
            chunk_lines = lines[i:i + max_lines_per_chunk]
            chunks.append(chunk_lines)
        
        return chunks
    
    def construct(self):
        # Define the layout grid (like CSS Grid)
        # Top area: 20% (for title/header)
        # Middle area: 60% (for content)
        # Bottom area: 20% (for footer/spacing)
        
        title_y = 3    # Top area
        content_y = 0  # Middle area (center)
        footer_y = -3  # Bottom area
        
        # Create persistent title
        title = Text("Financial Help", font_size=40, color=BLUE, weight=BOLD)
        title.move_to([0, title_y, 0])
        
        # Split content into logical chunks
        content_chunks = self.chunk_text(self.text_content)
        
        # Scene 1: Title Introduction
        self.play(Write(title), run_time=1.5)
        self.wait(1)
        
        # Process each chunk as separate "grid cells" - create as many scenes as needed
        scene_count = 0
        
        for chunk_text in content_chunks:
            # Create multiple sub-chunks from this text to ensure ALL content is shown
            text_sub_chunks = self.create_grid_text_chunks(chunk_text, max_width=35, max_lines_per_chunk=3)
            
            for sub_chunk_lines in text_sub_chunks:
                scene_count += 1
                
                # Create text objects for each line with smaller font
                text_objects = []
                for line in sub_chunk_lines:
                    if line.strip():  # Only add non-empty lines
                        text_obj = Text(line.strip(), font_size=24, color=WHITE)
                        text_objects.append(text_obj)
                
                # Skip if no valid text objects
                if not text_objects:
                    continue
                    
                # Arrange lines vertically in the content area
                content_group = VGroup(*text_objects)
                content_group.arrange(DOWN, buff=0.2, center=True)
                content_group.move_to([0, content_y, 0])
                
                # Ensure content fits within the middle area bounds
                if content_group.height > 3.5:  # Stricter height limit
                    scale_factor = 3.5 / content_group.height
                    content_group.scale(scale_factor)
                    content_group.move_to([0, content_y, 0])
                
                # Create a subtle background for this content chunk
                bg_rect = RoundedRectangle(
                    width=content_group.width + 1,
                    height=content_group.height + 0.8,
                    corner_radius=0.2,
                    color=DARK_GRAY,
                    fill_opacity=0.1,
                    stroke_opacity=0.3
                )
                bg_rect.move_to(content_group.get_center())
                
                # Add objects to scene and animate
                self.add(bg_rect, content_group)
                self.play(
                    FadeIn(bg_rect),
                    FadeIn(content_group),
                    run_time=1.5
                )
                
                self.wait(3)  # Display time for each chunk
                
                # Remove objects from scene before next chunk
                self.play(
                    FadeOut(bg_rect),
                    FadeOut(content_group),
                    run_time=0.8
                )
                self.remove(bg_rect, content_group)  # Explicitly remove from scene
        
        # Final scene: Summary or call-to-action
        summary_text = Text(
            "Need more help? Ask another question!",
            font_size=24,
            color=YELLOW,
            slant=ITALIC
        )
        summary_text.move_to([0, footer_y, 0])
        
        self.play(FadeIn(summary_text), run_time=1.5)
        self.wait(2)
        
        # Final fade out
        self.play(
            FadeOut(title),
            FadeOut(summary_text),
            run_time=1.5
        )
        self.wait(0.5)
'''
    
    # Write scene file
    scene_file = job_dir / "financial_help_scene.py"
    with open(scene_file, 'w') as f:
        f.write(scene_content)
    
    update_status("processing", 30, "Scene file created, setting up Manim environment...")
    
    # Configure Manim output directory
    media_dir = job_dir / "media"
    media_dir.mkdir(exist_ok=True)
    
    try:
        update_status("processing", 40, "Running Manim to generate video...")
        
        # Run Manim to generate video
        cmd = [
            "manim",
            "-pql",  # preview, quality low for faster rendering
            str(scene_file),
            "FinancialHelpScene",
            "--media_dir", str(media_dir)
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(job_dir))
        
        if result.returncode != 0:
            update_status("failed", 0, f"Manim failed: {result.stderr}")
            raise Exception(f"Manim failed: {result.stderr}")
        
        update_status("processing", 70, "Video rendering completed, searching for output files...")
        
        # Find the generated video file
        video_files = list(media_dir.glob("**/*.mp4"))
        if not video_files:
            update_status("failed", 0, "No video file generated by Manim")
            raise Exception("No video file generated")
        
        video_path = str(video_files[0])
        update_status("processing", 80, f"Video generated successfully: {video_path}")
        
        # Generate voiceover after video is complete
        update_status("processing", 85, "Starting voiceover generation with ElevenLabs...")
        voiceover_path = generate_voiceover(text_content, job_id)
        if voiceover_path:
            update_status("processing", 90, f"Voiceover generated successfully: {voiceover_path}")
            
            # Merge video with voiceover
            try:
                merged_video_path = merge_video_with_audio(video_path, voiceover_path, job_id, status_callback)
                update_status("processing", 99, f"Final video with audio created: {merged_video_path}")
                return merged_video_path  # Return the merged video instead
            except Exception as e:
                update_status("processing", 95, f"Merging failed, returning original video: {str(e)}")
                return video_path  # Return original video if merging fails
        else:
            update_status("processing", 90, "Voiceover generation failed, but video is available")
            return video_path
        
    except Exception as e:
        update_status("failed", 0, f"Video generation failed: {str(e)}")
        raise Exception(f"Video generation failed: {str(e)}")
    
    finally:
        # Clean up scene file
        if scene_file.exists():
            scene_file.unlink()
