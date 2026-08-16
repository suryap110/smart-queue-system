# Smart Queue Management System (Government Hospital Enterprise Edition)

A commercial-grade, multi-tenant **Smart Queue & Patient Flow Management System** designed for high-volume government hospitals, multi-department clinical workflows, and Play Store Android app release via Capacitor.

---

## 🌟 Key Features

### 1. Multi-Tier Clinical Workflow & Department Transfers
- **Patient Routing**: Registration → Nurse Triage → Doctor OPD Consultation → Diagnostic Lab / Radiology → Dispensary Pharmacy.
- **Inter-Department Transfer**: OPD Doctors can transfer patients directly to Lab or Pharmacy queues without requiring re-registration.

### 2. Multi-Lingual & Voice Speech Announcements
- Full **English & Hindi (हिंदी)** UI toggle.
- **Bilingual Text-to-Speech (TTS)** voice announcements for waiting halls (*"Attention: Token OPD-042, please report to Room 101"*).
- Visual TV Display Board with audio chime alert.

### 3. Government Health Scheme & Fair-Aging Priority
- **ABHA ID / Ayushman Bharat** health card tracking.
- Dedicated priority queues for **Emergency Red-Tag, Senior Citizens, Maternal / Pregnant Women, and Differently Abled**.
- **Fair-Aging Algorithm**: Dynamically increases priority scores over time to prevent regular tokens from being starved indefinitely.

### 4. AI-Powered Wait-Time Microservice
- Python **FastAPI** service using `scikit-learn` `GradientBoostingRegressor` to predict wait times based on historical queue length, hour of day, and active counters.
- Automatic fallback to dynamic non-linear formula if AI service is offline.

### 5. Medical Superintendent Portal & SLA Compliance
- Interactive **Recharts** dashboard displaying arrival heatmaps and department load shares.
- One-click exportable **CSV SLA Reports** for government compliance.
- Immutable **Audit Log Trail** tracking every manual override or emergency bypass.

### 6. Thermal Ticket Printing & Capacitor Mobile Ready
- Printable paper ticket preview with embedded **QR Code**.
- PWA manifest + **Capacitor Android wrapper** setup (`capacitor.config.json`) ready for Firebase Push Notifications.

---

## 🏗️ Monorepo Architecture

```
smart-queue-system/
├── apps/
│   ├── web/                 # React 18 + Vite + Tailwind CSS + Recharts
│   ├── api/                 # Node.js + Express + Prisma + Socket.io
│   └── ai-service/          # Python FastAPI ML Microservice
├── packages/
│   └── shared-types/        # Shared TypeScript interfaces & DTOs
├── docker-compose.yml       # PostgreSQL 16 + Redis 7 + API + Web + AI
├── .env.example
└── README.md
```

---

## 🚀 Quick Start & Installation

### Option 1: Local Development (Node.js & npm)

1. **Install workspace dependencies**:
   ```bash
   npm install
   ```

2. **Push Database Schema & Seed Demo Data**:
   ```bash
   npm run db:push
   npm run seed
   ```

3. **Start Applications Concurrently**:
   ```bash
   npm run dev
   ```
   - **Frontend Web**: [http://localhost:5173](http://localhost:5173)
   - **Node Backend API**: [http://localhost:4000](http://localhost:4000)
   - **AI Microservice**: Run `python apps/ai-service/main.py` ([http://localhost:8000](http://localhost:8000))

---

### Option 2: Docker Compose Setup

Run the entire system in containerized production mode:
```bash
docker-compose up --build -d
```

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Super Admin / Superintendent** | `superadmin@aiiph.gov.in` | `Admin@123` | Full SLA Analytics, Audit Logs, Staff Management |
| **OPD Doctor** | `doctor@aiiph.gov.in` | `Doctor@123` | Doctor OPD Console, Call Patient, Transfer Dept |
| **Nurse Staff** | `nurse@aiiph.gov.in` | `Nurse@123` | Triage & Vitals Queue Console |
| **Dispensary Staff** | `staff@aiiph.gov.in` | `Staff@123` | Pharmacy Dispensing Console |

---

## 📱 Mobile App (Capacitor Android Release)

To generate the native Android Studio project:
```bash
cd apps/web
npm run build
npx cap add android
npx cap open android
```
From Android Studio, choose **Build > Generate Signed Bundle / APK** for Play Store submission.
