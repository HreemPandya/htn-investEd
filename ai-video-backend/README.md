# AI Video Backend Setup Guide

This backend provides video generation using Cohere (LLM) + Manim (animation) + Supabase (storage).

## Prerequisites

1. **Python 3.10+**
2. **FFmpeg** (for video processing)
   - Windows: Download from https://ffmpeg.org/download.html and add to PATH
   - macOS: `brew install ffmpeg cairo pango pkg-config`
3. **Supabase Project** with a public bucket named "videos"

## Setup Instructions

### 1. Install Dependencies

```bash
cd ai-video-backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the `ai-video-backend` directory:

```env
COHERE_API_KEY=your_cohere_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_key
SUPABASE_BUCKET=videos
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Go to Storage → Create a new bucket named "videos"
3. Make the bucket public (for MVP)
4. Get your project URL and service key from Settings → API

### 4. Run the Backend

```bash
uvicorn app:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

## API Endpoints

- `POST /videos` - Start video generation
- `GET /videos/{job_id}` - Check video generation status
- `GET /` - Health check

## Frontend Integration

The frontend is already configured with:
- API proxy in `next.config.js`
- Video generation buttons in InsightsDashboard
- Chatbot integration for video responses
- Real-time polling for video status

## Testing

1. Start the backend: `uvicorn app:app --reload --port 8000`
2. Start the frontend: `npm run dev`
3. Navigate to InsightsDashboard and click "Generate Investment Video"
4. Or go to the Video Test page via the 🎬 button

## Troubleshooting

- **Manim errors**: Ensure FFmpeg is installed and in PATH
- **Supabase errors**: Check bucket permissions and API keys
- **Cohere errors**: Verify API key is valid and has credits
- **CORS errors**: Backend is configured to allow all origins for development
