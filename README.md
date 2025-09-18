# InvestEd

**InvestEd** is an AI-powered financial literacy app that transforms confusing bank statements into fun, engaging, and personalized explainer videos.  
Built at **Hack the North 2025**, our goal was to help students (and beyond) understand their spending habits, save smarter, and invest toward their "my first..." goals — laptop, car, trip, and more.



## 🚀 Inspiration
As university students, we know how overwhelming personal finance can feel. Charts, statements, and jargon rarely help — they only add stress.  
We wanted to make saving and investing **accessible, engaging, and educational**. By combining **AI + video storytelling**, InvestEd gives your money a voice.

> 🧾 **76% of Canadians struggle with saving consistently**, and Millennials/Gen Z overspend by ~15% monthly vs. their budgets.  
InvestEd helps close that gap.


## 🤖 What It Does
- **AI Finance Assistant (Portfolius)**: Explains your spending habits in plain English.  
- **Personalized Explainer Videos**: Automatically generated with Manim, breaking down overspending and showing how small changes build big savings.  
- **Interactive Web App**: Clean Next.js frontend where users can view insights, generate videos, and replay them anytime.  
- **Positive Nudges**: Instead of guilt, InvestEd reframes overspending as opportunities to save & invest.  


## 🛠️ How We Built It
- **Frontend**: Next.js + TailwindCSS → Clean, banking-inspired UI.  
- **Backend**: FastAPI (Python) → Orchestrates video generation pipeline.  
- **Cohere LLM**: Generates short, simple scripts explaining overspending & investment tips.  
- **Manim Renderer**: Converts scripts into animated explainer videos in under 30 seconds.  
- **Supabase Storage**: Stores and serves large MP4 files securely via public/signed URLs.  
- **Deployment**: Frontend on Vercel; Backend on Render/Heroku.  


## 🧗 Challenges We Ran Into
- CORS issues & API rewrites during frontend ↔ backend integration.  
- Optimizing **Manim** video rendering (initially minutes → now sub-30s).  
- Handling **large MP4 storage & retrieval** with Supabase.  
- Coordinating multiple independent components into one seamless pipeline.  


## 🏆 Accomplishments We’re Proud Of
- Built a **full end-to-end pipeline**: Cohere → Manim → Supabase → Frontend in <30s.  
- Designed a **seamless, banking-style interface** inspired by real finance apps.  
- Learned to optimize AI prompts, rendering configs, and storage integration for hackathon constraints.  
- Delivered a **working demo** that turns raw spending data into a clear, animated video.  


## 💡 What We Learned
- **Prompt engineering** is critical for syncing AI-generated scripts with video timing.  
- **Pipeline orchestration** (status polling, error handling) keeps UX smooth.  
- **Rendering optimizations** (fps, resolution, animation simplification) can make or break performance.  
- **Team integration** matters: constant communication = faster debugging.  


## 🔮 What’s Next
- **Gamified learning**: Streaks & rewards for saving more consistently.  
- **Cloud scaling**: Offload heavy rendering to worker nodes for parallel video generation.  
- **Mobile apps**: Bring InvestEd to iOS & Android for anywhere access.  


## 📸 Screenshots / Demo
 


## ⚡ Getting Started

### Prerequisites
- Node.js 18+  
- Python 3.10+  
- Supabase account  
- Cohere API key  

### Setup
```
# Clone repo
git clone https://github.com/<your-org>/invested.git
cd invested

# Frontend setup
cd frontend
npm install
```

### Environment Variables

Create .env files in frontend/ and backend/ with:
```npm run dev```
```
# Backend setup
cd ../backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```
```
# Frontend
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```
```
# Backend
COHERE_API_KEY=your_cohere_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Team InvestEd

- **Rishi** — Backend (Cohere integration, API orchestration)

- **Hreem** — Frontend design & implementation

- **Hetarth** — Video storage & analytics integration

- **Ayman** — Manim optimization & rendering pipeline

## Acknowledgements

**Cohere**
 for LLM API access.

**Manim**
 for rendering videos.

**Supabase**
 for storage & database support.

***Hack the North 2025 organizers & mentors.***
