# 🏥 Arogya Sakhi 

> **Rural Health Logistics & Triage System: Turning every ASHA worker's phone into a life-saving diagnostic bridge.**

![Arogya Sakhi Banner](./public/banner.png)

---

## 🛠️ Tech Stack

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=Twilio&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)

---

## 🌍 The Problem & The Solution

**The Gap in Rural Healthcare:**
In rural India, healthcare delivery is severely bottlenecked by low digital literacy, dozens of regional language barriers, and a heavy reliance on easily damaged or lost paper medical records. When medical emergencies strike, the lack of immediate, context-aware communication between patients, ASHA (Accredited Social Health Activist) workers, and District Hospitals often results in delayed care and lost lives. 

**Our Solution:**
Arogya Sakhi bridges this critical infrastructure gap by transforming a standard smartphone into an intelligent, logistics-aware healthcare hub. By utilizing speech-to-text AI for zero-literacy triage, multimodal vision models to digitize handwritten prescriptions, and offline-resilient QR codes for medical history, the platform empowers ASHA workers to make rapid, informed decisions. It seamlessly connects the local village to district resources, instantly coordinating with families and ambulances via automated SMS infrastructure during critical moments.

---

## ✨ Key Features

* 🎙️ **Multilingual Voice Triage:** Integrates **Sarvam AI** for native speech-to-text capabilities, allowing rural patients to describe symptoms in local languages while the system categorizes the medical urgency without requiring them to type a single word.
* 📸 **AI Prescription Vision:** Leverages **Gemini 2.5 Flash** to scan messy, handwritten paper prescriptions, automatically extracting medicines, dosages, and timings into a clean, structured UI table to prevent medication errors.
* 🚨 **Family SOS Tree (SMS Integration):** Features a prominent, pulsing SOS button that uses the **Twilio SMS API** to send automated emergency text alerts to linked family members, while simultaneously opening the native `tel:108` dialer to dispatch an ambulance.
* 📱 **Medical Identity QR Codes:** Utilizes `qrcode.react` to generate unique patient QR codes. ASHA workers can scan these to instantly retrieve Firebase UIDs and critical medical history (such as blood type and allergies).
* 📊 **Admin & ASHA Logistics Dashboard:** A real-time data hub utilizing `recharts` to track critical medicine inventory levels (like ORS and Paracetamol) and `react-leaflet` to visualize Disease Outbreak Heatmaps for proactive district surveillance.

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[Patient Voice Input / QR Scan] -->|Next.js Frontend| B(API Gateway)
    B --> C{Flask Triage & Logic Agent}
    C <-->|Stateful Memory| D[(LangGraph)]
    C -->|Vision Data| E[Gemini 2.5 Flash API]
    C -->|Urgency: Emergency| F[Twilio SMS Alert]
    F --> G[Linked Family Tree]
    C -->|Urgency: Routine| H[Firestore Database]
    H --> I[Admin Dashboard Heatmaps & Inventory]
📂 Folder Structure
Plaintext
arogya-sakhi/
├── frontend/               # Next.js 14 App Router UI
│   ├── app/                # Page routes (chat, dashboard, admin)
│   ├── components/         # UI elements (QR Scanner, SOS Button, Maps)
│   ├── public/             # Static assets (banner.png goes here!)
│   └── package.json
├── backend/                # Python Flask Server & AI Logic
│   ├── app.py              # Main API entry point
│   ├── agents/             # LangGraph stateful chat memory
│   ├── services/           # Gemini and Twilio integration modules
│   └── requirements.txt
└── README.md
🚀 Getting Started
Follow these instructions to run Arogya Sakhi locally.

Prerequisites
Node.js (v18+)

Python (3.9+)

API Keys for Firebase, Gemini, and Twilio.

1. Clone the Repository
Bash
git clone [https://github.com/your-username/arogya-sakhi.git](https://github.com/your-username/arogya-sakhi.git)
cd arogya-sakhi
2. Setup the Backend (Flask)
Bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
Create a .env file in the backend/ directory:

Code snippet
GEMINI_API_KEY=your_gemini_key_here
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
Start the Flask server:

Bash
python app.py
3. Setup the Frontend (Next.js)
Open a new terminal window and navigate to the frontend directory:

Bash
cd frontend
npm install
Create a .env.local file in the frontend/ directory with your Firebase config details:

Code snippet
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
Start the Next.js development server:

Bash
npm run dev
The application will be available at http://localhost:3000.
