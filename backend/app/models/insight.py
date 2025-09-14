from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base
import datetime

class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    text = Column(String)
    video_url = Column(String, nullable=True)
    video_job_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
