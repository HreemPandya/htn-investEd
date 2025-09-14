import os
import uuid
import subprocess
import tempfile
from pathlib import Path
from manim import *
from elevenlabs import generate, save, set_api_key
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize ElevenLabs
set_api_key(os.getenv("ELEVENLABS_API_KEY"))

class FinancialHelpScene(Scene):
    def __init__(self, text_content, **kwargs):
        super().__init__(**kwargs)
        self.text_content = text_content
    
    def construct(self):
        # Create title
        title = Text("Financial Help", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        # Create the main text content
        main_text = Text(
            self.text_content,
            font_size=24,
            color=WHITE,
            line_spacing=1.2
        )
        
        # Split long text into multiple lines if needed
        if len(self.text_content) > 100:
            words = self.text_content.split()
            lines = []
            current_line = ""
            
            for word in words:
                if len(current_line + " " + word) <= 50:
                    current_line += " " + word if current_line else word
                else:
                    lines.append(current_line)
                    current_line = word
            
            if current_line:
                lines.append(current_line)
            
            main_text = VGroup(*[Text(line, font_size=24, color=WHITE) for line in lines])
            main_text.arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        
        # Center the text
        main_text.move_to(ORIGIN)
        
        # Animation sequence
        self.play(Write(title), run_time=1.5)
        self.wait(0.5)
        
        self.play(FadeIn(main_text), run_time=2)
        self.wait(3)
        
        # Highlight important parts (if any numbers or key terms)
        if any(char.isdigit() for char in self.text_content):
            highlight_box = SurroundingRectangle(main_text, color=YELLOW, buff=0.1)
            self.play(Create(highlight_box), run_time=1)
            self.wait(1)
            self.play(FadeOut(highlight_box), run_time=0.5)
        
        self.wait(2)
        
        # Fade out
        self.play(FadeOut(title), FadeOut(main_text), run_time=1.5)

def generate_financial_help_video(text_content: str, job_id: str) -> str:
    """
    Generate a Manim video for financial help text content.
    
    Args:
        text_content: The financial help text to animate
        job_id: Unique identifier for the job/video
    
    Returns:
        Path to the generated video file
    """
    # Create job directory
    job_dir = Path(f"C:/Users/hreem/htn-investEd/backend/videos/{job_id}")
    job_dir.mkdir(parents=True, exist_ok=True)
    
    # Create temporary scene file
    scene_content = f'''
from manim import *
import sys
import os

class FinancialHelpScene(Scene):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.text_content = """{text_content}"""
    
    def construct(self):
        # Create title
        title = Text("Financial Help", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        # Create the main text content
        main_text = Text(
            self.text_content,
            font_size=24,
            color=WHITE,
            line_spacing=1.2
        )
        
        # Split long text into multiple lines if needed
        if len(self.text_content) > 100:
            words = self.text_content.split()
            lines = []
            current_line = ""
            
            for word in words:
                if len(current_line + " " + word) <= 50:
                    current_line += " " + word if current_line else word
                else:
                    lines.append(current_line)
                    current_line = word
            
            if current_line:
                lines.append(current_line)
            
            main_text = VGroup(*[Text(line, font_size=24, color=WHITE) for line in lines])
            main_text.arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        
        # Center the text
        main_text.move_to(ORIGIN)
        
        # Animation sequence
        self.play(Write(title), run_time=1.5)
        self.wait(0.5)
        
        self.play(FadeIn(main_text), run_time=2)
        self.wait(3)
        
        # Highlight important parts (if any numbers or key terms)
        if any(char.isdigit() for char in self.text_content):
            highlight_box = SurroundingRectangle(main_text, color=YELLOW, buff=0.1)
            self.play(Create(highlight_box), run_time=1)
            self.wait(1)
            self.play(FadeOut(highlight_box), run_time=0.5)
        
        self.wait(2)
        
        # Fade out
        self.play(FadeOut(title), FadeOut(main_text), run_time=1.5)
'''
    
    # Write scene file
    scene_file = job_dir / "financial_help_scene.py"
    with open(scene_file, 'w') as f:
        f.write(scene_content)
    
    # Configure Manim output directory
    media_dir = job_dir / "media"
    media_dir.mkdir(exist_ok=True)
    
    try:
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
            raise Exception(f"Manim failed: {result.stderr}")
        
        # Find the generated video file
        video_files = list(media_dir.glob("**/*.mp4"))
        if not video_files:
            raise Exception("No video file generated")
        
        # Generate voiceover after video is created
        print(f"Generating voiceover for job {job_id}...")
        voiceover_path = generate_voiceover(text_content, job_id)
        
        if voiceover_path:
            print(f"Voiceover generated successfully: {voiceover_path}")
        else:
            print("Voiceover generation failed, but video was created")
        
        # Return the path to the video file
        return str(video_files[0])
        
    except Exception as e:
        raise Exception(f"Video generation failed: {str(e)}")
    
    finally:
        # Clean up scene file
        if scene_file.exists():
            scene_file.unlink()

def generate_voiceover(text_content: str, job_id: str) -> str:
    """
    Generate ElevenLabs voiceover for the financial help text.
    
    Args:
        text_content: The text to convert to speech
        job_id: Unique identifier for the job
    
    Returns:
        Path to the generated audio file
    """
    try:
        # Get voice ID from environment
        voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Default voice
        
        # Generate audio using ElevenLabs
        audio = generate(
            text=text_content,
            voice=voice_id,
            model="eleven_monolingual_v1"
        )
        
        # Create job directory if it doesn't exist
        job_dir = Path(f"C:/Users/hreem/htn-investEd/backend/videos/{job_id}")
        job_dir.mkdir(parents=True, exist_ok=True)
        
        # Save audio to job directory
        audio_path = job_dir / "voiceover.mp3"
        save(audio, str(audio_path))
        
        print(f"Voiceover saved to: {audio_path}")
        return str(audio_path)
        
    except Exception as e:
        print(f"Error generating voiceover: {e}")
        return None
