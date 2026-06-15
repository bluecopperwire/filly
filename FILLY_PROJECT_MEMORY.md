# FILLY_PROJECT_MEMORY.md

## Project Overview

**Project Name:** FILLY
**Project Type:** Filipino Grammarly-like Writing Assistant
**Description:** FILLY is a web-based Filipino writing assistance system that combines:
1. N-gram-based text normalization
2. Transformer-based grammar error correction
to provide real-time writing feedback.

---

## Core Technologies

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **TipTap Editor**
- **Zustand**
- **Axios**

### Backend
- **Python**
- **FastAPI**
- **Pydantic**
- **SQLAlchemy**
- **Uvicorn**

### Database
- **SQLite** (Development)
- **PostgreSQL** (Production)

### NLP Components
- **PyTorch**
- **Transformers**
- **GECToR**
- **RoBERTa Tagalog Large**

---

## Research Foundations

### Text Normalization
- **Based on:** *Look Ma, Only 400 Samples! Revisiting the Effectiveness of Automatic N-Gram Rule Generation for Spelling Normalization in Filipino*
- **Repository:** [efficient-spelling-normalization-filipino](https://github.com/ljyflores/efficient-spelling-normalization-filipino)
- **Purpose:** Detect and normalize slang, abbreviations, spelling variations, and noisy text.
- **Examples:**
  - `aq` → `ako`
  - `u` → `ikaw`
  - `nmn` → `naman`

### Grammar Error Correction
- **Based on:** *Balarila: Deep Learning for Semantic Grammar Error Correction in Low-Resource Settings*
- **Model:** GECToR + RoBERTa Tagalog Large
- **Purpose:** Detect grammatical errors, generate correction suggestions, and allow user acceptance or rejection.

---

## UI Design Requirements

### Layout
1. **Left Sidebar:**
   - FILLY logo
   - Write
   - Analytics
   - Guide
2. **Center Panel:**
   - Document title
   - Upload button
   - Save button
   - Editor
   - Word counter
3. **Right Panel:**
   - Recommendations
   - Accept suggestion
   - Ignore suggestion

### Normalization Suggestions Behavior
- Underline word in red.
- Hover displays normalization suggestion (e.g., `aq → ako`).
- Accept replaces text.
- Ignore dismisses suggestion.

### Grammar Suggestions Behavior
- Highlight grammar issue.
- Display recommendation in side panel.
- Accept updates text.
- Ignore removes recommendation.

---

## Architecture

### Frontend
```text
frontend/
├── src/
│   ├── pages/
│   │   ├── AnalyticsPage.tsx
│   │   ├── GuidePage.tsx
│   │   └── WritePage.tsx
│   ├── components/
│   │   ├── Editor.tsx
│   │   ├── RecommendationsPanel.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SuggestionCard.tsx
│   │   ├── Toolbar.tsx
│   │   └── WordCounter.tsx
│   ├── editor/
│   │   ├── GrammarMark.ts
│   │   └── NormalizationMark.ts
│   ├── hooks/
│   │   └── useDebounce.ts
│   ├── services/
│   │   └── api.ts
│   ├── store/
│   │   ├── analyticsStore.ts
│   │   └── editorStore.ts
│   └── types/
│       └── index.ts
```

### Backend
```text
backend/
├── app/
│   ├── api/          # TODO: Create endpoints
│   ├── services/     # TODO: Create services (Normalization, GEC)
│   ├── models/
│   │   └── models.py
│   ├── schemas/
│   │   └── schemas.py
│   ├── database/
│   │   └── database.py
│   ├── core/
│   │   └── config.py
│   └── main.py       # TODO: Create entry point
│
├── normalization/    # TODO: Create normalization scripts
└── gec/              # TODO: Create gec scripts
```

---

## PROJECT STATUS

### COMPLETED
- Frontend UI components: Sidebar, Navigation, Writer interface, Word Counter, and Recommendation Panel cards.
- TipTap Editor integration with custom text decoration marks: `GrammarMark` and `NormalizationMark`.
- Frontend state management via Zustand stores (`editorStore.ts` and `analyticsStore.ts`).
- Frontend service configuration (`api.ts`) pointing to `/api/*` backend routes.
- Backend database schema using SQLAlchemy (`models.py`) with tables for `documents` and `suggestions`.
- Backend Pydantic schema validation (`schemas.py`) for requesting analysis, saving docs, and retrieving stats.

### IN PROGRESS
- Initializing the FastAPI server application setup.

### NEXT TASKS
- Create `backend/app/main.py` entrypoint.
- Setup CORS middleware, error handlers, database initialization on startup, and endpoints.
- Build n-gram based spelling normalization service under `backend/normalization/`.
- Build GECToR + RoBERTa spelling/grammar correction service under `backend/gec/`.
- Connect frontend saving/loading functionality to actual API paths.

### BLOCKERS
- None

---

## DEVELOPMENT LOG

- **Date:** 2026-06-16
- **Task:** Initialized persistent project memory document (`FILLY_PROJECT_MEMORY.md`).
- **Files Created:** [FILLY_PROJECT_MEMORY.md](file:///d:/files/Online%20Classes/College/3rd%20Year%20/2nd%20Sem/random/filly/FILLY_PROJECT_MEMORY.md)
- **Files Modified:** None
- **Reasoning:** Created documentation mapping current progress, technology stack, and architecture schemas so future sessions can immediately resume development.
- **Next Step:** Create backend entrypoint server under `backend/app/main.py`.

---

## API DOCUMENTATION

### POST /api/analyze
- **Purpose:** Analyze text for normalizations and grammar corrections.
- **Request Schema:**
  ```json
  {
    "text": "string"
  }
  ```
- **Response Schema:**
  ```json
  {
    "normalizations": [
      {
        "word": "string",
        "suggestion": "string",
        "start": 0,
        "end": 0,
        "type": "normalization",
        "confidence": 0.0
      }
    ],
    "grammar_corrections": [
      {
        "original": "string",
        "correction": "string",
        "start": 0,
        "end": 0,
        "type": "grammar",
        "rule": "string",
        "message": "string"
      }
    ]
  }
  ```

### POST /api/document
- **Purpose:** Create or save a new document.
- **Request Schema:**
  ```json
  {
    "title": "string",
    "content": "string"
  }
  ```
- **Response Schema:**
  ```json
  {
    "id": 0,
    "title": "string",
    "content": "string",
    "word_count": 0,
    "created_at": "string",
    "updated_at": "string"
  }
  ```

### GET /api/document/{id}
- **Purpose:** Retrieve a document by ID.
- **Response Schema:** `DocumentResponse` (matches fields in POST `/api/document`)

### POST /api/upload
- **Purpose:** Extract text from an uploaded file (.docx or .txt).
- **Request Schema:** Multipart form-data with field name `file`.
- **Response Schema:**
  ```json
  {
    "text": "string"
  }
  ```

---

## DATABASE DOCUMENTATION

### Table: `documents`
- `id` (Integer, Primary Key)
- `title` (String, default "Untitled")
- `content` (Text, default "")
- `word_count` (Integer, default 0)
- `created_at` (DateTime, UTC timezone)
- `updated_at` (DateTime, UTC timezone, updates on change)

### Table: `suggestions`
- `id` (Integer, Primary Key)
- `document_id` (Integer, ForeignKey to `documents.id`)
- `type` (String, 'normalization' or 'grammar')
- `original` (Text)
- `suggestion` (Text)
- `start_pos` (Integer)
- `end_pos` (Integer)
- `accepted` (Boolean, default False)
- `ignored` (Boolean, default False)
- `created_at` (DateTime, UTC timezone)

---

## HOW TO RESUME DEVELOPMENT

1. **Current State:**
   - Frontend is fully structured and running on Vite dev server at `http://localhost:5173`.
   - Backend database configurations, models, and schemas are defined, but the server application entry point (`main.py`) and specific handlers under `app/api/` and `app/services/` are yet to be built.
2. **Last Completed Task:** Initialized project memory document mapping the current repository structure.
3. **Current Unfinished Task:** Building the API endpoints in FastAPI to support the frontend application.
4. **Immediate Next Task:** Create `backend/app/main.py` and set up endpoints matching the API documentation.
5. **Commands Needed to Run Project:**
   - **Frontend:**
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - **Backend:**
     ```bash
     cd backend
     python -m venv venv
     # Activate venv:
     # Windows: .\venv\Scripts\activate
     # Bash: source venv/bin/activate
     pip install -r requirements.txt
     uvicorn app.main:app --reload
     ```
6. **Important Implementation Decisions:**
   - Vite is configured to proxy all `/api` traffic to `http://localhost:8000`.
   - Text analyzer uses PyTorch and Transformers (RoBERTa Tagalog Large).
