from app.core.database import SessionLocal, Base, engine
from app.models.transaction_db import TransactionDB
import datetime

# recreate tables
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

mock_data = [
    TransactionDB(user_id="demo", merchant="Starbucks", amount=25.0,
                  date=datetime.datetime(2025, 8, 20), description="Coffee runs", category="Food"),
    TransactionDB(user_id="demo", merchant="Netflix", amount=15.0,
                  date=datetime.datetime(2025, 8, 22), description="Monthly subscription", category="Entertainment"),
    TransactionDB(user_id="demo", merchant="Walmart", amount=200.0,
                  date=datetime.datetime(2025, 8, 25), description="Groceries", category="Essentials"),
]

db.add_all(mock_data)
db.commit()
db.close()

print("✅ Database seeded with mock transactions for user_id='demo'")
