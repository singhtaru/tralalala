# Amazon Now - Quick Commerce AI Assistant Prototype

This project contains a React Native Expo frontend and a FastAPI Python backend integrated with an AI shopping assistant.

---

## Running the Project

To run the full prototype, you need to start both the Python backend and the Expo web server.

### 1. Run the Backend (FastAPI)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Start the FastAPI development server:
   * **Windows (Direct / Recommended):**
     ```powershell
     .\venv\Scripts\python.exe -m uvicorn main:app --reload
     ```
   * **Windows (With Activation):**
     ```powershell
     .\venv\Scripts\activate
     uvicorn main:app --reload
     ```
   * **macOS / Linux:**
     ```bash
     source venv/bin/activate
     uvicorn main:app --reload
     ```
   The backend server will run on [http://localhost:8000](http://localhost:8000).

---

### 2. Run the Frontend (React Native Expo Web)

1. Open a separate terminal in the root `HackOn` project directory.
2. Install the workspaces and frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Expo web application:
   ```bash
   npm run web
   ```
   The app will compile and launch in your browser at [http://localhost:8081](http://localhost:8081).

---

## Core Features Implemented

* **AI Voice Assistant**: Tapping mic icons inside Search or Header triggers native browser speech-to-text, redirecting to the voice assistant window.
* **Instant Intent Checkout**: Supports typing/saying emergency and occasion queries (e.g. *"I cut my finger"*, *"Unexpected guests arrived"*, *"Need a quick breakfast"*, *"Order butter"*) to auto-generate contextually scored product baskets.
* **Dynamic Cart Sync**: Items added/removed in the assistant or listing screens update the backend cart dynamically (prices computed directly by backend, eliminating `NaN` errors).
* **Checkout Tracker**: Place order completes the transaction, updating user wallet balances (or emergency deposits) and initiating live delivery tracking.

