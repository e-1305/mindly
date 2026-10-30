# mindly

> Daily mental check-in app for HR teams — making the invisible visible, without exposing anyone.

![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![AWS](https://img.shields.io/badge/AWS-Lambda%20·%20DynamoDB%20·%20Bedrock-ff9900) ![License: MIT](https://img.shields.io/badge/license-MIT-green)

## The problem

Burnout rarely shows up in a dashboard until someone resigns or goes on sick leave. Annual engagement surveys are too slow, and managers are bad at reading their team's state from the outside. But asking employees how they feel creates a new risk: **if answers can be traced back to a person, people stop answering honestly, and the company now holds sensitive data about them.**

## What it does

Each employee answers 4 quick questions per day (mood, energy, stress, mental load) in about 30 seconds.

| Role | View |
|---|---|
| Employee | Daily check-in · Personal trend charts · Avatar builder · Their own data only |
| Manager | **Anonymous** team averages · Team-level signal ("2 of 5 report high stress") · AI insight · AI advisor chat |
| HR | Org heatmap · Group breakdown · AI advisor chat |

## Privacy by design

Self-reported mood and stress can reveal information about someone's health, which GDPR (art. 9) treats as a special category of data. So the product is built around one rule: **managers and HR see teams, never individuals.**

| Safeguard | Where |
|---|---|
| Managers only receive team aggregates (averages, counts per band, daily trend), never per-person scores | [`backend/src/routes/insights.ts`](backend/src/routes/insights.ts) |
| Nothing is shown for a team (or a day) with fewer than `MIN_GROUP_SIZE` respondents (default 5) | [`backend/src/lib/privacy.ts`](backend/src/lib/privacy.ts) |
| Free-text notes never leave the employee's own view | `ProjectionExpression` in the team query |
| The AI model receives aggregates only: no user IDs, no individual scores, no notes | [`backend/src/lib/agent.ts`](backend/src/lib/agent.ts) |
| EU region by default (`eu-west-1`) so data is processed in the EU | [`backend/src/lib/bedrock.ts`](backend/src/lib/bedrock.ts) |

Before any real deployment, a company would still need a legal basis and a DPIA, clear employee information, and voluntary participation. This repo is a demo, not a compliance kit.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Auth | Firebase Authentication |
| Backend | Node.js + Express + TypeScript |
| Database | AWS DynamoDB |
| AI | AWS Bedrock (Claude, model configurable via `BEDROCK_MODEL_ID`) |
| RAG | Zaki et al. (2009) + Rehmatullah & Ickes embedded as system context |
| Deploy | AWS SAM (Lambda + API Gateway) |

## Quick start

```bash
# 1. Start local DynamoDB (optional — skip if using real AWS)
docker-compose up -d

# 2. Backend
cd backend
cp .env.example .env   # then set your AWS region and Bedrock model
npm install
npm run seed           # creates DynamoDB tables + demo users
npm run dev            # API on :3001

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env
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

1. Use your own AWS credentials (AWS CLI profile or environment variables). Never commit them.
2. In AWS Console → Bedrock → Model access, enable a Claude model in your region.
3. Put its model ID in `BEDROCK_MODEL_ID` (backend `.env`, or the `BedrockModelId` parameter at deploy).

## Deploy to AWS

```bash
cd infrastructure
sam build
sam deploy --guided   # asks for BedrockModelId
```

## AI Advisor

The advisor (floating ✦ button, manager/HR only) is a RAG chat powered by Claude on Bedrock. Its system prompt embeds:

- **Zaki et al. (2009)** — neural bases of empathic accuracy (why managers misread teams)
- **Rehmatullah & Ickes** — research methods for studying personal relationships (diary studies, behavior-proximal reporting)
- **Mindly score interpretation guide** — thresholds, red flags, recommended actions

## Limits and next steps

- The dashboards run on demo data; wiring them to `GET /insights/team` is the next step.
- The HR org heatmap still draws one node per person in the demo. Next: group-level nodes with the same minimum group size.
- No automated tests yet beyond type-checking.
- Not a medical tool: it does not diagnose anything and should always point people to real support (manager, HR, occupational health).

## Project structure

```
mindly/
├── frontend/          React app
│   └── src/
│       ├── components/   Avatar, AvatarBuilder, OrgHeatmap, AdvisorChat, …
│       ├── pages/        CheckIn, Dashboard, ManagerDashboard, HRDashboard, Settings
│       └── lib/          store, api, firebase, orgData, avatarTypes
├── backend/           Express API
│   └── src/
│       ├── routes/       auth, checkin, insights, chat
│       └── lib/          db, auth, agent, bedrock, privacy, ragDocs
├── infrastructure/    AWS SAM template
├── pitch/             Pitch deck generator
└── docker-compose.yml Local DynamoDB
```

## License

[MIT](LICENSE)
