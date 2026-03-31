# mindly

> Daily mental check-in app for HR teams — making the invisible visible.

## What it does

Each employee answers 4 quick questions per day (mood, energy, stress, mental load). Managers get aggregated trends and at-risk alerts. HR gets an org-wide heatmap. Everyone gets an AI advisor grounded in workplace psychology research.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Auth | Firebase Authentication |
| Backend | Node.js + Express + TypeScript |
| Database | AWS DynamoDB |
| AI | AWS Bedrock (Claude 3 Haiku) |
| RAG | Zaki et al. (2009) + Rehmatullah & Ickes embedded as system context |
| Deploy | AWS SAM (Lambda + API Gateway) |

## Roles

| Role | View |
|---|---|
| Employee | Daily check-in · Personal trend charts · Avatar builder |
| Manager | Team overview · At-risk alerts · AI advisor chat |
| HR | Org graph heatmap · Group breakdown · AI advisor chat |

## Quick start

```bash
# 1. Start local DynamoDB (optional — skip if using real AWS)
docker-compose up -d

# 2. Backend
cd backend
cp .env.example .env   # already filled if you have AWS creds
npm install
npm run seed           # creates DynamoDB tables + demo users
npm run dev            # API on :3001

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev            # app on :5173
```

Open http://localhost:5173 and use the demo buttons on the login screen.

## Demo accounts

| Role | Button | Credentials (if using Firebase) |
|---|---|---|
| Employee | "employee" | alex@company.com / password123 |
| Manager | "manager" | sophie@company.com / password123 |
| HR | "hr" | isabelle@company.com / password123 |

## AWS setup

The `.env` is pre-filled with workshop credentials. When they expire, replace:

```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_SESSION_TOKEN=...
```

Enable Claude 3 Haiku in AWS Console → Bedrock → Model access (us-west-2).

## Deploy to AWS

```bash
cd infrastructure
sam build
sam deploy --guided
```

## AI Advisor

The advisor (floating ✦ button, manager/HR only) is a RAG chat powered by Claude 3 Haiku. Its system prompt embeds:

- **Zaki et al. (2009)** — neural bases of empathic accuracy (why managers misread teams)
- **Rehmatullah & Ickes** — research methods for studying personal relationships (diary studies, behavior-proximal reporting)
- **Mindly score interpretation guide** — thresholds, red flags, recommended actions

## Project structure

```
mindly/
├── frontend/          React app
│   └── src/
│       ├── components/   Avatar, AvatarBuilder, OrgHeatmap, AdvisorChat, …
│       ├── pages/        CheckIn, Dashboard, ManagerDashboard, HRDashboard, Settings
│       └── lib/          store, api, firebase, orgData, avatarTypes, ragDocs
├── backend/           Express API
│   └── src/
│       ├── routes/       auth, checkin, insights, chat
│       └── lib/          db, auth, agent, ragDocs
├── infrastructure/    AWS SAM template
└── docker-compose.yml Local DynamoDB
```
