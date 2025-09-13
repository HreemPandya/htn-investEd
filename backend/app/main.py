from fastapi import FastAPI
from app.api import transactions, insights, classify, chatbot, health
from app.core.database import Base, engine
from app.models.transaction_db import TransactionDB

# create tables
Base.metadata.create_all(bind=engine)
app = FastAPI(title="RBC Insights Backend")

# include routers
app.include_router(health.router, prefix="/health")
app.include_router(transactions.router, prefix="/transactions")
app.include_router(insights.router, prefix="/insights")
app.include_router(classify.router, prefix="/classify")
app.include_router(chatbot.router, prefix="/chatbot")
