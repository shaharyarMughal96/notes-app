# NoteFlow — MERN Notes App

A full-stack notes app with rich text editing, tags, search, and auto-save.

## Stack
- **Frontend:** React 19 + Vite, Quill.js (rich text), Lucide icons
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas or local)

## Project Structure

```
notes-app/
├── server/          ← Express API
│   ├── index.js
│   ├── models/Note.js
│   ├── routes/notes.js
│   └── .env         ← create from .env.example
└── client/          ← React frontend
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── RichEditor.jsx
        │   ├── NoteCard.jsx
        │   ├── TagInput.jsx
        │   └── SaveStatus.jsx
        ├── hooks/
        │   ├── useAutoSave.js
        │   └── useDebounce.js
        └── utils/api.js
```

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env — paste your MongoDB Atlas URI
npm install
npm run dev        # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev        # starts on http://localhost:5173
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/notes` | List notes (`?search=&tag=&sort=`) |
| GET | `/api/notes/:id` | Get single note |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |
| GET | `/api/notes/meta/tags` | All unique tags |

## Features

- **Rich text editor** — Quill with toolbar (headings, bold, italic, lists, code, links)
- **Auto-save** — debounced 900ms after you stop typing
- **Tags** — add with Enter/comma, autocomplete from existing tags, filter sidebar by tag
- **Search** — live search across title, content, and tags
- **Pin notes** — pinned notes float to the top
- **Note colors** — 7 background color options per note
- **Dark sidebar, light editor** — clean split-pane layout
