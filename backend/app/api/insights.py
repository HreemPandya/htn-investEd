from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import os, time, random, requests

from app.core.database import SessionLocal
from app.services import transaction_crud
from app.utils.schemas import Transaction
from app.models.classifier import classify
from app.models import Insight  # make sure you have an Insight model with video_url + job_id

# Push notifications
from app.core.notifications import send_push_notification  # assumes you created this already

router = APIRouter()

VIDEO_API = os.getenv("VIDEO_API_URL", "http://localhost:8000")  # AI-video backend

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def request_video_from_insight(insight_text: str):
    payload = {"prompt": insight_text, "style": "friendly", "duration_sec": 18}
    res = requests.post(f"{VIDEO_API}/videos", json=payload)
    if res.status_code == 200:
        return res.json()["id"]
    else:
        raise Exception(f"Failed to request video: {res.text}")

def check_video_status(job_id: str):
    res = requests.get(f"{VIDEO_API}/videos/{job_id}")
    if res.status_code == 200:
        return res.json()
    else:
        raise Exception(f"Failed to fetch video status: {res.text}")

@router.get("/")
async def get_insights(user_id: str, db: Session = Depends(get_db)):
    """
    Basic insights endpoint (returns insight only, no video).
    """
    user_txns = transaction_crud.get_transactions(db, user_id)
    if not user_txns:
        return {"user_id": user_id, "insight": "No transactions found yet."}

    unnecessary_total = 0.0
    for txn in user_txns:
        schema_txn = Transaction.from_orm(txn)
        if classify(schema_txn) == "unnecessary":
            unnecessary_total += schema_txn.amount

    return {
        "user_id": user_id,
        "unnecessary_total": unnecessary_total,
        "transactions_count": len(user_txns),
        "insight": f"You spent ${unnecessary_total:.2f} on non-essentials last month. "
                   f"That could cover half a new laptop payment! 💻"
    }

@router.post("/monthly")
async def run_monthly(user_id: str, db: Session = Depends(get_db)):
    """
    Orchestrator endpoint:
    - generate insight
    - request video
    - poll until ready
    - save video_url
    - send push notification
    """
    # 1. Generate insight
    user_txns = transaction_crud.get_transactions(db, user_id)
    if not user_txns:
        return {"user_id": user_id, "status": "no_transactions"}

    unnecessary_total = 0.0
    for txn in user_txns:
        schema_txn = Transaction.from_orm(txn)
        if classify(schema_txn) == "unnecessary":
            unnecessary_total += schema_txn.amount

    insight_text = (
        f"You spent ${unnecessary_total:.2f} on non-essentials last month. "
        f"That could cover half a new laptop payment! 💻"
    )

    # 2. Request video
    job_id = request_video_from_insight(insight_text)

    # 3. Poll until ready (simplified for demo — ideally use background worker)
    url = None
    for _ in range(20):  # ~100s wait
        status = check_video_status(job_id)
        if status["status"] == "ready":
            url = status["url"]
            break
        time.sleep(5)

    if not url:
        return {"status": "timeout", "job_id": job_id}

    # 4. Save to DB
    db_insight = Insight(
        user_id=user_id,
        text=insight_text,
        video_url=url,
        video_job_id=job_id
    )
    db.add(db_insight)
    db.commit()
    db.refresh(db_insight)

    # 5. Send push notification (demo: static token, replace with lookup)
    clickbaits = [
        "☕ You spent too much on coffee! Tap to see your story 🎥",
        "🔥 Your wallet is crying… see how last month went 🚀",
        "💸 You could’ve bought a MacBook by now. Proof inside 👀"
    ]
    fcm_token = "user-device-token"  # TODO: fetch from your Users table
    send_push_notification(
        fcm_token,
        title="Your Money Story is Ready!",
        body=random.choice(clickbaits),
        url=url
    )

    return {"status": "success", "video_url": url, "job_id": job_id}
