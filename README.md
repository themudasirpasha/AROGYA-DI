# AROGYA-DI

**AI-Powered District Health Command Center**
<img width="1134" height="198" alt="Screenshot 2026-07-06 092812" src="https://github.com/user-attachments/assets/4f8755ce-5012-41cd-b9dd-0559fc4a1839" />


*"From scattered records to defensible action."*

Built for the Google Cloud Hackathon 2026 — *AI for Better Living and Smarter Communities*

---

## Overview

AROGYA-DI is a decision intelligence platform that helps district health officers turn scattered, structured, and unstructured health data into evidence-backed decisions — in seconds instead of hours. A single conversational interface lets an officer ask a plain-language question and get back an answer, an anomaly flag, a forecast, or a recommended action, all grounded in real data.

**Live - https://arogya-di-244972601130.us-central1.run.app

---

## Problem Statement

Modern communities generate large volumes of structured and unstructured data — but turning that information into actionable insight remains a major challenge. AROGYA-DI addresses this for the healthcare and community wellness domain: district-level epidemic intelligence and hospital load balancing.

---

## Features

| Feature | Description |
|---|---|
| **Talk-to-your-data** | Ask any question in plain language (English, Hindi, or Kannada) and get an answer, table, or chart |
| **Anomaly detection** | Flags disease/outbreak spikes against seasonal baselines |
| **7-day forecasting** | BigQuery ML (ARIMA_PLUS) forecasts for AQI and disease trends |
| **Multimodal image analysis** | Upload a field photo; Gemini Vision flags likely mosquito/dengue breeding sites with a confidence score and recommended action |
| **Voice transcription** | Converts citizen helpline calls / field voice notes into text (English, Hindi, Kannada) |
| **Live proactive alerting** | Pub/Sub-based alerts, checked and surfaced through the same conversation |
| **What-if intervention simulator** | Projects the impact of earlier screening, extra hospital beds, or increased vector control |
| **Live air quality lookup** | Real-time AQI via Google's Air Quality API, alongside historical trends |
| **Geo/map data** | City-level air quality with coordinates, ready for map rendering |
| **Responsible AI** | Automated evaluation for groundedness, tool-routing accuracy, and jailbreak resistance |

---

<img width="1175" height="637" alt="Screenshot 2026-07-06 093409" src="https://github.com/user-attachments/assets/4c8be241-a695-4a13-8541-476808fa7abf" />


## Architecture

```
User (any language)
        │
        ▼
 ┌─────────────────────────┐
 │   ADK Orchestrator      │   <- single agent, decides which tool to call
 │  (Gemini 2.5 Flash)     │
 └─────────────────────────┘
        │
        ├──► query_health_data       → BigQuery Conversational Analytics (verified queries)
        ├──► check_live_air_quality  → Google Air Quality API
        ├──► simulate_intervention   → custom what-if model
        ├──► publish_health_alert /
        │    check_pending_alerts    → Pub/Sub
        └──► (via /api/upload)       → Gemini Vision (image) / Speech-to-Text (audio)
```

All of this sits behind a single FastAPI service, deployed on Cloud Run.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Data warehouse | BigQuery |
| Conversational agent | BigQuery Conversational Analytics (Agent Catalog), verified queries |
| Orchestration | Agent Development Kit (ADK) |
| Reasoning | Gemini 2.5 Flash |
| Forecasting | BigQuery ML (ARIMA_PLUS) |
| Multimodal ingestion | Vertex AI Gemini Vision, Cloud Speech-to-Text |
| Live data | Google Air Quality API |
| Alerting | Pub/Sub |
| Backend | FastAPI, Python 3.12 |
| Deployment | Cloud Run (Docker) |

---

## Datasets

| Dataset | Source | Use |
|---|---|---|
| Zika outbreaks (state-wise) | data.gov.in | Anomaly / surveillance |
| Hospital readmissions | Kaggle (India Hospital Readmissions) | Risk scoring |
| Air quality (city-wise) | Kaggle (Air Quality Data in India) | Trend + forecasting |
| City coordinates | Manually curated | Geo/map rendering |
| Hospital infrastructure (rural/urban, statewise, defence, AYUSH) | data.gov.in / Kaggle | Hospital load-balancing insight |

---

<img width="1179" height="510" alt="Screenshot 2026-07-06 094224" src="https://github.com/user-attachments/assets/6364e638-b7f5-4b28-a523-e1ab25be5c15" />

## Repository Structure

```
arogya-di-project/
├── backend/
│   ├── data/                  # Dataset CSVs and BigQuery load script
│   ├── bigquery/              # Verified queries and system instructions
│   ├── multimodal/            # Vision, speech-to-text, live air quality tools
│   ├── whatif_simulator/      # Intervention impact model
│   ├── alerts/                # Pub/Sub publisher and subscriber
│   ├── api/
│   │   ├── app.py             # FastAPI entrypoint
│   │   └── adk_agent.py       # ADK orchestrator + tool definitions
│   ├── eval/                  # Agent evaluation (groundedness, safety, jailbreak tests)
│   ├── Dockerfile
│   └── requirements.txt
│
└── frontend/
    ├── src/app/                # Angular application source
    ├── public/                 # Static assets
    ├── Dockerfile
    ├── nginx.conf
    └── angular.json
```

--
### 

<img width="1115" height="628" alt="Screenshot 2026-07-06 093106" src="https://github.com/user-attachments/assets/8cbd2c41-8c94-400b-be4a-b40558145955" />


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
<img width="1179" height="461" alt="Screenshot 2026-07-06 094301" src="https://github.com/user-attachments/assets/ff162f38-5fa3-4de7-8fd2-ed147ca6c975" />

Visit `http://localhost:8080/docs` for the interactive API explorer.

For the frontend:
```bash
cd arogya-di-project/frontend
npm install
ng serve
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
<img width="536" height="459" alt="Screenshot 2026-07-06 092157" src="https://github.com/user-attachments/assets/773d2938-1bbe-495e-b71f-57e26a61b9e2" />    <img width="522" height="388" alt="Screenshot 2026-07-06 092232" src="https://github.com/user-attachments/assets/ddd7d06f-f222-4759-b267-c6fa7310edcc" />


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

All four tests currently pass.

---

## Team

**Team Name:** When I'm With You

- Mudasir Pasha
- Voni Purujit

Built for Google Cloud Hackathon 2026 — *AI for Better Living and Smarter Communities*.
