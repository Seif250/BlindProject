# BlindProject

> A privacy-first collaboration platform for university teams. BlindProject lets students discover projects, request to join, and chat after mutual approval—keeping personal details hidden until trust is earned.

---

## Table of Contents
- [At a Glance](#at-a-glance)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Core User Journeys](#core-user-journeys)
- [API Surface](#api-surface)
- [Development Notes](#development-notes)
- [License](#license)

---

## At a Glance
- **Account control**: JWT-secured auth, profile editing, skills and interests, optional social links, and Multer-backed avatar uploads.
- **Team lifecycle**: Create teams with roles, required skills, tech stack, milestones, and resources. Track join requests, manage members, and monitor capacity.
- **Privacy-by-design**: Search pages and pending requests expose aliases and skill snapshots only. Email, WhatsApp, and avatars unlock after acceptance.
- **Conversation requests**: One-on-one chat starts as a request. Recipients approve or reject before identities reveal; active threads provide message history and last-activity metadata.
- **Collaboration tools**: In-team chat, meeting links, resource cards, and a polished Material UI experience tuned to the dark theme.

## Architecture
- **Frontend**: React 18, React Router v6, Material UI, Emotion, Axios.
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs, Multer.
- **Ops & Tooling**: dotenv-configured environments, CORS rules, Vercel-ready client build, Nixpacks deployment spec.

## Quick Start

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas cluster (or local MongoDB instance)

### 2. Clone the repository
```bash
git clone https://github.com/Seif250/BlindProject.git
cd BlindProject
```

### 3. Install and run the backend
```bash
cd server
npm install
```
Create `server/.env` (see [Environment Variables](#environment-variables)). Then start the API:
```bash
npm start
```
You should see `MongoDB Connected` in the console.

### 4. Install and run the frontend
Open another terminal in the repo root:
```bash
cd client
npm install
npm start
```
The React app runs at `http://localhost:3000`.

## Environment Variables
Place the following keys in `server/.env`:

| Key | Description |
| --- | --- |
| `PORT` | API port (default `5000`). |
| `MONGO_URI` | MongoDB connection string. |
| `JWT_SECRET` | Long, random string used to sign tokens. |
| `FRONTEND_URL` | Deployed client origin for CORS (e.g. `http://localhost:3000`). |

If you deploy the client, configure its environment (e.g. `REACT_APP_API_URL`) to point to the backend URL you expose.

## Project Structure
```
BlindProject/
├── client/
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   ├── conversations/
│       │   ├── layout/
│       │   ├── profile/
│       │   ├── teams/
│       │   └── styled/
│       ├── contexts/
│       ├── services/
│       └── theme/
└── server/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── uploads/
    └── server.js
```

## Core User Journeys
1. **Create a team**: Define project details, required skills, and coordination links. Accepted members see full details; applicants see anonymized snapshots.
2. **Search teams**: Browse open teams, request to join, or request a private chat with the owner while identities remain hidden.
3. **Manage requests**: Owners approve or reject join requests from an alias-based queue and can remove members later.
4. **Approve conversations**: Any member can send a chat request. Approval reveals real identities and unlocks the conversation inbox.
5. **Collaborate**: Accepted members use team chat, resources, meeting links, and role tracking to stay aligned.

## API Surface

### Authentication
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Users
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users/:userId`

### Teams
- `POST /api/teams`
- `GET /api/teams/my-team`
- `GET /api/teams/requests`
- `POST /api/teams/:teamId/request`
- `POST /api/teams/requests/:requestId/accept`
- `POST /api/teams/requests/:requestId/reject`
- `DELETE /api/teams/:teamId/members/:userId`
- `DELETE /api/teams/:teamId/leave`
- `GET /api/search/teams`

### Conversations
- `POST /api/conversations` – submit a chat request
- `GET /api/conversations/pending` – view incoming/outgoing requests
- `POST /api/conversations/:conversationId/respond` – accept or reject
- `GET /api/conversations` – list active conversations
- `GET /api/conversations/:conversationId/messages`
- `POST /api/conversations/:conversationId/messages`

## Development Notes
- Sensitive fields (name, email, WhatsApp, avatar) are omitted from responses unless the viewer is an accepted participant or the conversation is active. Keep this guardrail when adding endpoints or UI features.
- Conversation snapshots store skills at request time. Update `server/controllers/conversationController.js` if you expose new profile metadata in pending views.
- Review `server/server.js` CORS rules before deploying; set `FRONTEND_URL` and additional origins as needed.

## License

BlindProject is released under the ISC License. Refer to the repository for the full text.
