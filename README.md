<img width="1500" height="437" alt="image" src="https://github.com/user-attachments/assets/4fba09d0-0db6-407c-9b18-220b35ad5b08" />


# AROGYA-DI

<img width="1134" height="198" alt="Screenshot 2026-07-06 092812" src="https://github.com/user-attachments/assets/f87d09bd-12fa-4253-975c-4bc0651318cc" />

**AI-Powered District Health Command Center**

*"From scattered records to defensible action."*

Built for the Google Cloud Hackathon 2026 — *AI for Better Living and Smarter Communities*

---

## Overview

AROGYA-DI is a decision intelligence platform that helps district health officers turn scattered, structured, and unstructured health data into evidence-backed decisions — in seconds instead of hours. Two dedicated conversational agents let an officer ask a plain-language question and get back an answer, an anomaly flag, a forecast, a district risk ranking, or a doctor's exact working hours — all grounded in real data.

**Live** — https://arogya-di-v2-244972601130.us-central1.run.app
<img width="1450" height="670" alt="image" src="https://github.com/user-attachments/assets/5101b272-9110-422c-8ef0-a4f05f6234c6" />

---

## Problem Statement

Modern communities generate large volumes of structured and unstructured data — but turning that information into actionable insight remains a major challenge. AROGYA-DI addresses this for the healthcare and community wellness domain: district-level epidemic intelligence, doctor resource allocation, and hospital load balancing across Karnataka.

---

## Features

| Feature | Description |
|---|---|
| **Talk-to-your-data** | Ask any question in plain language (English, Hindi, or Kannada) and get an answer, table, or chart |
| **7-week disease forecasting** | BigQuery ML (ARIMA_PLUS) forecasts dengue and other disease trends with confidence intervals |
| **Statistical anomaly detection** | Z-score based flagging of disease case spikes that are statistically abnormal versus a district's historical baseline |
| **District health leaderboard** | All 31 Karnataka districts ranked by population-normalized risk score, with auto-linked health officer contact |
| **Doctor-disease gap correlation** | Cross-references disease burden against doctor/specialty availability to flag critical staffing shortages per district |
| **Dedicated doctor availability agent** | Separate conversational agent for real-time lookup of doctor specialty, working hours, and government/private facility across all 31 districts |
| **Multimodal image analysis** | Upload a field photo; Gemini Vision flags likely mosquito/dengue breeding sites with a confidence score and recommended action |
| **Voice transcription** | Converts citizen helpline calls / field voice notes into text (English, Hindi, Kannada) |
| **Live proactive alerting** | Pub/Sub-based alerts, checked and surfaced through the same conversation |
| **What-if intervention simulator** | Projects the impact of earlier screening, extra hospital beds, or increased vector control |
| **Live air quality lookup** | Real-time AQI via Google's Air Quality API, alongside historical trends |
| **Responsible AI** | Automated evaluation for groundedness, tool-routing accuracy, and jailbreak resistance |

---

## Architecture
<img width="1412" height="653" alt="image" src="https://github.com/user-attachments/assets/300b5f58-f1f4-4eae-9b0a-e13d7d10a629" />

Two agents sit behind a single FastAPI service (`/api/chat`, `/api/doctor-chat`), deployed on Cloud Run.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Data warehouse | BigQuery |
| Conversational agents | BigQuery Conversational Analytics (Agent Catalog) — Health Agent + Doctor Availability Agent, verified queries |
| Orchestration | Agent Development Kit (ADK) |
| Reasoning | Gemini 2.5 Flash |
| Forecasting | BigQuery ML (ARIMA_PLUS) |
| Anomaly detection | Statistical (z-score) via BigQuery views |
| Unstructured extraction | Dataplex + BigQuery Knowledge Catalog + Gemini semantic inference |
| Multimodal ingestion | Vertex AI Gemini Vision, Cloud Speech-to-Text |
| Live data | Google Air Quality API |
| Alerting | Pub/Sub |
| Backend | FastAPI, Python 3.12 |
| Frontend | Angular, Nginx |
| Deployment | Cloud Run (Docker) |

---

## Datasets

| Dataset | Type | Source | Processing | Feature/Model Created |
|---|---|---|---|---|
| 25 Weekly IDSP Disease Reports | PDF (unstructured) | Karnataka State Surveillance Unit | Dataplex + Gemini semantic extraction | Health Surveillance Chat, Dengue Forecast Model |
| 31 District Doctor PDFs | PDF (unstructured) | Karnataka Health Dept | Dataplex + Gemini semantic extraction | Doctor Availability Chat |
| District Disease Surveillance | CSV (structured) | IDSP-format district data | Direct BigQuery load | Anomaly Detection, Per-Capita Risk |
| Karnataka Population | CSV (structured) | Census 2011 | Direct BigQuery load | Population Normalization |
| Health Officials Directory | CSV (structured) | Karnataka Health Dept (official) | Direct BigQuery load | Alert Routing, District Leaderboard |
| Zika outbreaks, hospital readmissions, air quality, hospital infrastructure | Structured tables | data.gov.in / Kaggle | Pre-loaded BigQuery | Cross-domain correlation |

---

## Models, Agents & Derived Intelligence Layers

**Models built:**
- `dengue_forecast_model` — BigQuery ML (ARIMA_PLUS), 7-week dengue forecast with confidence intervals
- `disease_anomalies` — statistical (z-score), flags abnormal spikes vs historical average

**AI agents:**
- **Health Agent** — disease, forecast, anomalies, leaderboard, gap-correlation, AQI, hospital data → `/api/chat`
- **Doctor Availability Agent** — specialty, timings, facilities → `/api/doctor-chat`

**Derived intelligence layers (views):**
- `district_risk_normalized` — disease cases + population → cases per lakh
- `district_leaderboard` — risk data + officer directory → ranked risk score with contact
- `doctor_disease_gap` — doctors + disease burden → flags staffing gaps
- `disease_anomalies` — historical statistics → spike detection

---

**Snapshots of the Prototype**
<img width="1393" height="660" alt="image" src="https://github.com/user-attachments/assets/4a8ea1c4-ad60-41d2-a9aa-896a4f22f695" />

<img width="1394" height="646" alt="image" src="https://github.com/user-attachments/assets/8b3e6c8d-adaf-4c01-89ac-c88ff20c3288" />

<img width="1396" height="650" alt="image" src="https://github.com/user-attachments/assets/1d0b616a-285f-421c-9c7d-ec76d1231180" />

<img width="1256" height="684" alt="image" src="https://github.com/user-attachments/assets/de76317d-76f2-439d-ab27-fa13ac650da1" />

<img width="1378" height="641" alt="image" src="https://github.com/user-attachments/assets/8e5012cd-cc2f-459c-9c52-eafb96db0944" />

<img width="1460" height="631" alt="image" src="https://github.com/user-attachments/assets/739c3b2d-3bde-413f-a1e3-5191d8087f79" />
---

## Running Locally

```bash
git clone <this-repo-url>
cd arogya-di-project/backend

pip install -r requirements.txt

export GOOGLE_GENAI_USE_VERTEXAI=TRUE
export GOOGLE_CLOUD_PROJECT=<your-project-id>
export GOOGLE_CLOUD_LOCATION=us-central1

python3 -m uvicorn api.app:app --host 0.0.0.0 --port 8080
```

Visit `http://localhost:8080/docs` for the interactive API explorer.

For the frontend:
```bash
cd arogya-di-project/frontend
npm install
npx ng serve --host 0.0.0.0 --port 4200
```

---

## Deploying to Cloud Run

Backend:
```bash
cd arogya-di-project/backend
gcloud run deploy arogya-di-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_GENAI_USE_VERTEXAI=TRUE,GOOGLE_CLOUD_PROJECT=<your-project-id>,GOOGLE_CLOUD_LOCATION=us-central1
```

Frontend:
```bash
cd arogya-di-project/frontend
gcloud run deploy arogya-di-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Responsible AI

An automated evaluation suite (`eval/agent_eval.py`) tests:
- **Groundedness** — answers are derived from real data, not fabricated
- **Tool-routing accuracy** — the correct tool is called for the right question
- **Missing/invalid input handling** — the agent flags rather than guesses
- **Jailbreak resistance** — no destructive action is possible via prompt injection, since tools use parameterized, read-only queries

All tests currently pass.

---

## Team

**Team Name:** When I'm With You

- Mudasir Pasha
- Voni Purujit

Built for Google Cloud Hackathon 2026 — *AI for Better Living and Smarter Communities*.

<img width="1396" height="762" alt="image" src="https://github.com/user-attachments/assets/4ec24f9b-d1da-4f0d-bd70-11c081ed5bc4" />
