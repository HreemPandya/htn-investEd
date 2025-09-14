import os
import uuid
import subprocess
import tempfile
from pathlib import Path
from manim import *

# Old scene class removed - using the improved version in generate_financial_help_video function

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
    job_dir = Path(f"/Users/aymanfouad/Desktop/htnv2/htn-investEd/backend/videos/{job_id}")
    job_dir.mkdir(parents=True, exist_ok=True)
    
    # Create temporary scene file with CSS grid-like layout
    scene_content = f'''
from manim import *
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
    
    def create_grid_text(self, text, max_width=35):
        """Create text that fits within a grid cell with proper line wrapping"""
        words = text.split()
        lines = []
        current_line = ""
        
        for word in words:
            if len(current_line + " " + word) <= max_width:
                current_line += " " + word if current_line else word
            else:
                if current_line:
                    lines.append(current_line)
                current_line = word
        
        if current_line:
            lines.append(current_line)
        
        # Limit to maximum 3 lines per chunk to avoid overflow
        if len(lines) > 3:
            # Return only first 3 lines for this chunk
            return lines[:3]
        
        return lines
    
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
        
        # Process each chunk as a separate "grid cell"
        
        for i, chunk in enumerate(content_chunks):
            # Create content for this chunk
            lines = self.create_grid_text(chunk, max_width=35)
            
            # Create text objects for each line with smaller font
            text_objects = []
            for line in lines:
                if line.strip():  # Only add non-empty lines
                    text_obj = Text(line.strip(), font_size=24, color=WHITE)  # Smaller font size
                    text_objects.append(text_obj)
            
            # Skip if no valid text objects
            if not text_objects:
                continue
                
            # Arrange lines vertically in the content area
            content_group = VGroup(*text_objects)
            content_group.arrange(DOWN, buff=0.2, center=True)  # Center alignment instead of LEFT
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
        
        # Return the path to the video file
        return str(video_files[0])
        
    except Exception as e:
        raise Exception(f"Video generation failed: {str(e)}")
    
    finally:
        # Clean up scene file
        if scene_file.exists():
            scene_file.unlink()
