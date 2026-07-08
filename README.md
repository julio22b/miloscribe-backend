# MiloScribe — Backend

**API and AI processing for MiloScribe, a clinical AI assistant that turns recorded consultations into structured medical documents.**

This is the backend. It handles authentication, patient and consultation data, audio storage, and the AI pipeline that transcribes a consultation and generates a structured clinical document. For the full project story, the UI, and the audio-recording work, see the [frontend repository](https://github.com/julio22b/health-app-frontend)

---

## Tech stack

- **Node.js + Express + TypeScript**
- **Prisma ORM** with **PostgreSQL** (Supabase in production, local Postgres in development)
- **JWT authentication** with strict per-doctor data scoping
- **Multer + Cloudinary** for audio upload and storage
- **Google Gemini** (multimodal) for transcription and document generation
- Deployed on **Render**

---

## Data model

Four entities:

- **Doctor** — authenticated user; owns patients.
- **Patient** — belongs to a doctor; has many consultations.
- **Consultation** — belongs to a patient; holds the audio URL, transcript, and processing status; has many documents.
- **Document** — belongs to a consultation; holds the generated content and its type (`MEDICAL_HISTORY`, `PROGRESS_NOTE`, `DISCHARGE_SUMMARY`).

---

## API overview

**Auth**

- `POST /auth/register` — create a doctor account (bcrypt-hashed password).
- `POST /auth/login` — authenticate, returns a JWT.

**Patients** _(protected)_

- `GET /patients` — list the authenticated doctor's patients.
- `POST /patients` — create a patient scoped to the authenticated doctor.

**Consultations** _(protected)_

- `POST /consultations` — upload audio (multipart), create a consultation with status `PENDING`.
- `POST /consultations/process` — transcribe and generate a document via Gemini; sets `COMPLETED` / `FAILED`.
- `PATCH /consultations/:id/audio` — replace the audio for an existing consultation (re-record flow).

**Documents** _(protected)_

- `PATCH /documents/:id` — update a document's edited content.
- `DELETE /documents/:id` — delete a document; resets consultation status to `PENDING` only if no documents remain.

---

## AI processing pipeline

Recording/upload and AI processing are intentionally **separate endpoints** — uploads stay resilient on slow mobile connections, and it leaves room for a future "record now, process later" flow.

Processing uses a **single multimodal Gemini call**: the audio and a document-type-specific system prompt go in, and a structured JSON response comes back containing both a verbatim transcript and the finished document.

### Prompt design

Each document type has its own tailored system prompt. The medical-history prompt encodes real clinical conventions provided by the collaborating surgeon:

- A fixed, ordered set of physical-examination systems.
- Canonical "normal" descriptions filled in **only** when a system is unmentioned or explicitly called normal.
- Abnormal findings that **override** the normal template for that system.
- A hard safety boundary: the only permitted inference is filling standardized normal exam findings. The model is explicitly forbidden from inventing any history, symptom, medication, lab result, or diagnosis the physician didn't state.

---

## Environment variables

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GEN_AI_API_KEY=...
CLIENT_URL=http://localhost:5173
```

---

## Local development

```bash
npm install
# populate .env (see above)
npx prisma migrate dev
npm run dev
```

Prisma client is generated on install; migrations run against your `DATABASE_URL`. In production, the build runs `prisma generate && prisma migrate deploy` before compiling.

---

## Known limitations & future work

- **Audio format assumption.** The Gemini step assumes `audio/webm`.
- **Consultation-level status.** Status lives on the consultation, but a consultation can hold multiple documents in different states. It ideally belongs at the document level; kept at the consultation level for v1 simplicity.
