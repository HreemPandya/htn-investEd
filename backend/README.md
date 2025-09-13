## Features

# Transactions API → add and fetch transactions.
# Classifier API → simple rule-based “necessary vs unnecessary” classification.
# Insights API → aggregates user spending and generates witty insights.
# Seeder → pre-load demo transactions for user demo.
# SQLite persistence → all data survives restarts.

## Setup
1.Clone the repository
```
git clone <your-repo-url>
cd backend
```
2.Create and activate a virtual environment
```
python -m venv .venv 
.venv\Scripts\Activate.ps1     # PowerShell (Windows)
# or
source .venv/bin/activate      # Mac/Linux
``` 
3.Install dependencies 
``` pip install -r requirements.txt``` 

4.Seed the database (loads demo transactions) 
From the repo root:
``` python -m backend.scripts.seed_db ```

This creates app.db with mock data:
Starbucks $25 (Food, unnecessary)
Netflix $15 (Entertainment, unnecessary)
Walmart $200 (Essentials, necessary)

## Run the API

Start the FastAPI app:
``` uvicorn app.main:app --reload ```

By default it runs at ``` http://127.0.0.1:8000 ```

## API Endpoints

Health

GET /health/ping → check if server is alive.

Transactions

POST /transactions/ → add new transaction.

GET /transactions/?user_id=demo → list transactions for a user.

GET /transactions/all_raw → debug: list all transactions in DB.

Classify

POST /classify/ → classify transaction JSON as necessary/unnecessary.

Insights

GET /insights/?user_id=demo → generate spending insights.

Chatbot

POST /chatbot/ → chatbot stub (placeholder).


# Demo Workflow

Seed DB → python -m backend.scripts.seed_db

Run server → uvicorn app.main:app --reload

Test demo user:
```
Invoke-RestMethod -Uri "http://127.0.0.1:8000/transactions/?user_id=demo" -Method GET
Invoke-RestMethod -Uri "http://127.0.0.1:8000/insights/?user_id=demo" -Method GET
```

See witty insight like:
“You spent $40.00 on non-essentials last month. That could cover half a new laptop payment!”