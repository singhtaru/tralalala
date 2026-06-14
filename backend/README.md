# Quick Commerce AI Backend

FastAPI backend for the Amazon Now quick-commerce prototype. It provides product catalog APIs, cart APIs, and an AI shopping assistant that turns natural-language requests into recommended product baskets.

## What It Does

- Serves product data through `GET /products`.
- Manages an in-memory cart through `/cart` endpoints.
- Accepts assistant queries through `POST /chat`.
- Detects shopping intent using Groq when configured, with a rule-based fallback when no API key is available.
- Searches, filters, ranks, and groups products into useful baskets for requests like:
  - `I cut my finger`
  - `Order butter`
  - `Need snacks for guests`
  - `Healthy movie night under Rs 300`

## Project Structure

```text
backend/
├── main.py                     # FastAPI app, CORS, route registration
├── products.json               # Local product catalog
├── requirements.txt            # Python dependencies
├── models/
│   └── request_models.py       # Pydantic request/response schemas
├── routes/
│   ├── cart.py                 # Cart API routes
│   └── chat.py                 # Assistant chat API route
├── services/
│   ├── agent_service.py        # Main assistant orchestration
│   ├── cart_service.py         # In-memory cart logic
│   ├── llm_service.py          # Groq intent detection and reranking
│   ├── memory_service.py       # Session memory for chat context
│   └── product_service.py      # Product loading, search, ranking, baskets
└── scripts/
    └── generate_products_json.py
```

## Setup

From the `backend` directory:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

If the virtual environment already exists, you can just activate it:

```powershell
.\venv\Scripts\activate
```

## Environment Variables

Create a `.env` file in `backend/` if you want LLM-powered intent detection:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-70b-versatile
GROQ_BASE_URL=https://api.groq.com/openai/v1/chat/completions
DUMMYJSON_BASE_URL=https://dummyjson.com
```

Only `GROQ_API_KEY` is required for Groq usage. Without it, the backend still works using the rule-based fallback in `services/llm_service.py`.

## Run The Server

```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload
```

The API runs at:

```text
http://localhost:8000
```

Interactive API docs:

```text
http://localhost:8000/docs
```

## API Endpoints

### Health Check

```http
GET /
```

Returns:

```json
{
  "message": "Backend running"
}
```

### Products

```http
GET /products
```

Returns the product catalog used by the frontend and assistant.

### Chat Assistant

```http
POST /chat
Content-Type: application/json
```

Request:

```json
{
  "query": "Need healthy snacks for movie night under Rs 300",
  "session_id": "default"
}
```

Response includes:

- `intent`: parsed shopping intent.
- `recommended_items`: products suggested by the assistant.
- `candidate_baskets`: possible grouped baskets.
- `cart`: current backend cart.
- `message`: user-facing assistant message.
- `refinement_filters`: filters the frontend can show, like `Healthy` or `Budget Friendly`.

### Cart

```http
GET /cart
```

Returns current cart items, total, and quantity.

```http
POST /cart/items/{product_id}
```

Adds one quantity of a product.

```http
DELETE /cart/items/{product_id}
```

Removes one quantity of a product. If quantity reaches zero, the item is removed.

```http
POST /cart/clear
```

Clears all cart items.

```http
POST /cart/checkout
```

Checks out the current cart and clears it.

## How The Assistant Works

The assistant flow starts at `routes/chat.py`, then calls `services/agent_service.py`.

High-level flow:

1. Read previous session memory.
2. Detect user intent with `detect_intent()` from `llm_service.py`.
3. Search products with `search_products()` from `product_service.py`.
4. Filter and rank products by budget, occasion, category, and constraints.
5. Optionally rerank top products with Groq.
6. Build candidate baskets and quantity plans.
7. Add to cart, clear cart, checkout, or return recommendations depending on intent.
8. Save updated session context.

## Frontend Connection

The frontend calls this backend through `frontend/src/services/api.js`.

Expected base URL:

```js
const BASE_URL = "http://localhost:8000";
```

For Expo web on the same machine, `localhost` is usually fine. For a physical phone or emulator, use your computer's LAN IP instead, for example:

```js
const BASE_URL = "http://192.168.1.10:8000";
```

The backend enables CORS in `main.py`, so browser requests from the Expo frontend are allowed during development.

## Important Notes

- Cart data is stored in memory in `services/cart_service.py`, so it resets when the server restarts.
- There is no database yet.
- There is no real authentication yet.
- Payment, wallet, address, and order history are mostly frontend-side simulation.
- Product IDs are strings across the backend cart routes.
- If Groq is unavailable, the assistant falls back to deterministic rule-based intent detection.

## Quick Test Commands

```powershell
curl http://localhost:8000/
curl http://localhost:8000/products
curl http://localhost:8000/cart
```

Test chat:

```powershell
curl -X POST http://localhost:8000/chat `
  -H "Content-Type: application/json" `
  -d "{\"query\":\"Order butter\",\"session_id\":\"default\"}"
```

Add to cart:

```powershell
curl -X POST http://localhost:8000/cart/items/1
```

Checkout:

```powershell
curl -X POST http://localhost:8000/cart/checkout
```

## Troubleshooting

- If the frontend cannot connect, confirm the backend is running at `http://localhost:8000`.
- If using Expo on a phone, replace `localhost` in the frontend API client with your computer's LAN IP.
- If `/chat` works but gives simple responses, check whether `GROQ_API_KEY` is set.
- If cart data disappears, the backend likely restarted; current cart storage is in-memory only.
- If product images or external catalog enrichment fails, check network access and `DUMMYJSON_BASE_URL`.
