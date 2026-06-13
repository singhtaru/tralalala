from fastapi import FastAPI

from routes.cart import router as cart_router
from routes.chat import router as chat_router
from services.product_service import get_products

app = FastAPI(title="Quick Commerce AI Backend")

app.include_router(chat_router)
app.include_router(cart_router)


@app.get("/")
def home():
    return {"message": "Backend running"}


@app.get("/products")
def products():
    return get_products()
