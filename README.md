# TelePoem: Poem Booth Frontend

Next.js frontend for the TelePoem poem booth. It has a **client** experience for browsing poems, poets, collections and booths, and an **admin** area for managing them. It connects to the [TelePoem FastAPI backend](https://github.com/KahafSameer/TelePoem_PoemBoth_Backend_in_python_fastapi).

## Features (from `src/app`)

- **Client:** booth view (`/client/booth/[boothId]`), poems, poets, collections, search
- **Admin:** manage booths, collections (and their poems), poems and poets

## Tech Stack

Next.js 16 · React · TypeScript · Zustand · Tailwind CSS · Vitest + Testing Library + fast-check

## Prerequisites

- Node.js and npm
- A running TelePoem backend API

## Installation & Setup

```bash
git clone https://github.com/KahafSameer/TelePoem_PoemBoth_Frontend_in_next_react_on-versel.git
cd TelePoem_PoemBoth_Frontend_in_next_react_on-versel
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_backend_url_here
NEXT_PUBLIC_AUTO_ROTATE_INTERVAL=30
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the TelePoem backend |
| `NEXT_PUBLIC_AUTO_ROTATE_INTERVAL` | Auto-rotate interval for the client UI (default `30`) |

## Usage

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/          # client/ and admin/ routes
├── components/   # UI components
└── lib/          # API client and state
.kiro/specs/      # Design and task specs
```
