from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.cart import router as cart_router
from routes.chat import router as chat_router
from services.product_service import get_products

app = FastAPI(title="Quick Commerce AI Backend")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(cart_router)


@app.get("/")
def home():
    return {"message": "Backend running"}


@app.get("/products")
def products():
    return get_products()

