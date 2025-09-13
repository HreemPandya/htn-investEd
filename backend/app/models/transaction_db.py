from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base
import datetime

class TransactionDB(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    merchant = Column(String)
    amount = Column(Float)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)
