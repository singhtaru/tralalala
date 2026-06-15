# Amazon Now: Emergency & Intent-Based Shopping Assistant

> **"From Need to Order in Seconds — No Search, No Browsing, No Delay."**

An AI-powered commerce platform that transforms urgent shopping from a product-search problem into a need-solving experience. Customers describe their situation and AI instantly understands the intent, generates the right products, handles payment flexibility, and enables ordering in seconds.

---

## Problem Statement

Traditional e-commerce platforms still require users to search, compare, and manually build carts — a process that takes minutes and creates friction during urgent situations like injuries, baby emergencies, unexpected guests, or household shortages.

**Amazon Now** eliminates this friction entirely. Instead of:

```
Search → Browse → Compare → Purchase (4+ minutes)
```

The journey becomes:

```
Describe Need → AI Builds Cart → Confirm → Delivered (under 30 seconds)
```

---

## Key Features

### 1. AI Intent-Based Shopping
Speak or type a situation. The AI classifies intent, matches products, ranks options, and generates a ready-to-purchase cart.

- "Order butter" → Top-rated Amul Butter 500g with alternatives
- "I want chips" → Lays, Kurkure, Nachos ranked by rating
- "I need a healthy breakfast" → Oats, Eggs, Milk, Banana

### 2. Emergency Mode
One-tap emergency cart generation for urgent situations:

- **Injury**: "I cut my finger" → Bandages, Antiseptic, Cotton, Medical Tape
- **Fever**: "I have a fever" → Thermometer, Juice, Water
- **Baby Care**: "Baby ran out of diapers" → Diapers, Baby Wipes
- **Power Outage**: "No electricity" → LED Bulb, Water, Instant Food

### 3. Alexa Voice Ordering
Hands-free shopping using Web Speech API:
- Real-time speech-to-text conversion
- Animated voice visualization
- 5-second silence timeout with auto-submit
- Rotating prompt examples for discoverability

### 4. Emergency Deposit Wallet
Locked payment reserve that auto-activates during emergencies:
- Separate from standard Amazon Wallet
- Only tapped when wallet is insufficient for emergency orders
- Ensures urgent purchases are never blocked by low balance

### 5. Smart Product Ranking
Multi-factor weighted scoring algorithm:
- **40%** Product Rating
- **25%** Delivery Speed
- **20%** Purchase Frequency
- **15%** Repeat Purchase Rate

### 6. Dynamic Alternative Suggestions
Context-aware refinement filters after recommendation:
- Best Seller | Organic | Premium | Budget Friendly
- Filters re-rank products in real-time without page reload

### 7. Pay Later (UI Ready)
Order proceeds without upfront payment — designed for urgency-first commerce.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER DEVICE                           │
│  React Native (Expo) + Web Speech API + Animated UI         │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────────┐
│                     FASTAPI BACKEND                          │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Intent      │  │ Product      │  │ Cart            │   │
│  │ Detection   │  │ Ranking      │  │ Management      │   │
│  │ (LLM +     │  │ Engine       │  │                 │   │
│  │  Fallback)  │  │              │  │                 │   │
│  └──────┬──────┘  └──────┬───────┘  └─────────────────┘   │
│         │                 │                                  │
│  ┌──────▼─────────────────▼───────┐                         │
│  │     Agent Orchestrator         │                         │
│  │  (Search → Filter → Rank →    │                         │
│  │   Rerank → Basket Build)      │                         │
│  └────────────────────────────────┘                         │
│                                                             │
│  ┌────────────────────────────────┐                         │
│  │   Data Layer                   │                         │
│  │   • BigBasket CSV (27K items)  │                         │
│  │   • Curated JSON (92 items)    │                         │
│  │   • In-memory session state    │                         │
│  └────────────────────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  CLOUD DEPLOYMENT                            │
│  AWS Amplify (Frontend) → ALB → ECS Fargate (Backend)      │
│  ECR (Container Registry) | VPC | CloudFormation (IaC)     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React Native + Expo 51 | Cross-platform mobile/web UI |
| Voice | Web Speech API | Browser-native speech recognition |
| Animation | React Native Animated | Delivery tracking, voice visualizer |
| Backend | FastAPI (Python 3.11) | High-performance async API |
| AI - Primary | Groq Cloud (LLaMA 3.1 70B) | Intent classification & product reranking |
| AI - Fallback | Rule-based NLU engine | 40+ pattern matches for offline mode |
| Data Processing | Pandas | CSV dataset ingestion & filtering |
| Validation | Pydantic | Request/response schema enforcement |
| Container | Docker | Portable backend packaging |
| Hosting | AWS Amplify | Frontend static hosting |
| Compute | Amazon ECS Fargate | Serverless container execution |
| Registry | Amazon ECR | Docker image storage |
| Network | AWS VPC + ALB | Security isolation + load balancing |
| IaC | AWS CloudFormation | Infrastructure automation |

---

## Project Structure

```
amazon-now/
├── frontend/                    # React Native Expo application
│   ├── App.js                   # Root component & state management
│   ├── src/
│   │   ├── screens/             # All application screens (15+)
│   │   ├── components/          # Reusable UI components
│   │   │   ├── catalog/         # Product cards, shelves, images
│   │   │   ├── home/            # Header, search, promo, quick actions
│   │   │   ├── common/          # Top bar, keyboard, notifications
│   │   │   ├── navigation/      # Bottom navigation bar
│   │   │   └── layout/          # App shell wrapper
│   │   ├── data/                # Intent engine, product data, products.json
│   │   ├── services/            # API client (fetch wrapper)
│   │   └── theme/               # Colors, shadows design tokens
│   └── assets/                  # Images, intro video, logo
├── backend/                     # FastAPI Python backend
│   ├── main.py                  # App entry point & route registration
│   ├── routes/
│   │   ├── chat.py              # POST /chat — AI assistant endpoint
│   │   └── cart.py              # CRUD /cart — cart management
│   ├── services/
│   │   ├── agent_service.py     # Orchestrator: intent → search → rank → respond
│   │   ├── llm_service.py       # Groq LLM integration + fallback NLU
│   │   ├── product_service.py   # Product loading, search, ranking engine
│   │   ├── cart_service.py      # In-memory cart state
│   │   └── memory_service.py    # Session memory with TTL
│   ├── models/
│   │   └── request_models.py    # Pydantic schemas
│   ├── products.json            # Curated product catalog (92 items)
│   ├── Dockerfile               # Container build configuration
│   └── requirements.txt         # Python dependencies
├── BigBasket Products.csv       # Extended product dataset (27,555 items)
├── package.json                 # Workspace scripts
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- (Optional) Groq API key for LLM-powered intent detection

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/amazon-now.git
cd amazon-now
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Optional: Configure LLM**
Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile
```
> The app works fully without an API key using the rule-based fallback engine.

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Run the Application

**Start Backend** (Terminal 1):
```bash
cd backend
uvicorn main:app --reload
```
Backend runs at: http://localhost:8000

**Start Frontend** (Terminal 2):
```bash
cd frontend
npm run web
```
Frontend runs at: http://localhost:8081

---

## Usage Guide

### Voice Ordering
1. Tap the floating microphone button on the home screen
2. Speak naturally: "I cut my finger" or "Order butter"
3. AI generates a recommended basket
4. Tap "Add Recommended Basket" to add to cart
5. Proceed to checkout

### Emergency Mode
1. Tap "Emergency" in Quick Actions on the home screen
2. Select emergency type (Injury, Fever, Baby, Power Outage)
3. AI generates emergency-specific cart
4. One-tap checkout using Emergency Deposit if wallet is low

### Standard Shopping
1. Browse categories or search for products
2. Add items to cart
3. Review bill → Select payment method → Checkout
4. Track delivery in real-time with animated rider map

---

## AI Recommendation Pipeline

```
User Input → Intent Detection → Product Search → Constraint Filter
     → Multi-Factor Ranking → LLM Reranking → Basket Optimization → Response
```

**Dual-layer Intent Detection:**
- Primary: LLaMA 3.1 70B via Groq API (when configured)
- Fallback: 40+ regex patterns covering emergency, occasion, and product intents

**Blended Ranking:** 70% heuristic score + 30% LLM contextual reranking

**Basket Templates:** Pre-defined slot structures per occasion ensure coherent recommendations (e.g., first-aid basket always contains 4 medical items).

---

## Future Scope

- **Predictive Shopping** — AI anticipates needs before users order (diapers running low, groceries depleting)
- **Smart Family Accounts** — Shared emergency funds across family members
- **Elderly Care Integration** — Voice-based medicine ordering with caregiver notifications
- **Business Emergency Restocking** — B2B emergency supply for small shops/offices
- **Amazon Alexa Integration** — Native Alexa Skill for smart speaker ordering
- **DynamoDB Migration** — Persistent user data, order history, and personalization

---

## Team

| Name | Role |
|------|------|
| Shivani | Full-Stack Developer & Project Lead |

---

## License

This project was built for the Amazon HackOn hackathon. All rights reserved.
