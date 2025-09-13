from app.utils.schemas import Transaction

# simple keyword-based classifier
NECESSARY_KEYWORDS = ["rent", "tuition", "hydro", "insurance", "grocery", "gas"]
UNNECESSARY_KEYWORDS = ["coffee", "starbucks", "tim hortons", "uber eats", "netflix", "gaming"]

def classify(txn: Transaction) -> str:
    desc = (txn.description or txn.merchant).lower()

    # rule-based checks
    if any(word in desc for word in NECESSARY_KEYWORDS):
        return "necessary"
    if any(word in desc for word in UNNECESSARY_KEYWORDS):
        return "unnecessary"

    # fallback heuristic
    if txn.amount > 500:
        return "necessary"
    return "unnecessary"