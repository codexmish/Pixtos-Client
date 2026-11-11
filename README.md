# Pixtos — Frontend

A personal photo and video library. Upload photos and videos, find them by what is in them (AI tags), keep favorites, group them into albums and restore anything from the trash.

**Backend repo:** https://github.com/codexmish/Pixtos-Server

---

## Features

### Account
- Sign up with email OTP verification (6-digit code, resend after 1 minute)
- Sign in, forgot password and reset password with an email code
- Stay signed in: when the access token expires, a new one is fetched in the background (up to 7 days)
- Logout from the profile menu

### Library
- **All photos and videos**, newest first, grouped by day (Today, Yesterday, then dates)
- **Filter tabs:** All, Photos, Videos
- **Search** from the navbar, by file name or by what is in the photo (AI tags like `beach`, `car`, `bird`)
- **Upload:** drag and drop or browse, preview before upload, up to 20 files at once (100 MB each)
- **Photo viewer:** previous / next with arrow keys, favorite, add to album, download, photo details, move to trash
- **Select many:** favorite, add to album or move to trash in one go

### Favorites, trash and albums
- **Favorites** page with search
- **Trash:** restore, delete permanently or empty the whole trash
- **Albums:** create an album (empty or from selected photos), add photos from the library, remove a photo, delete an album (photos stay in the library)

### Profile
- Change avatar (image up to 5 MB)
- Edit name
- Change password
- **Storage widget** in the sidebar: used storage, media count and video count

---

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router, React Compiler), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui (Base UI), lucide-react icons |
| Server state | TanStack Query 5 |
| Forms | TanStack Form + Zod 4 validation |
| HTTP | ofetch |
| OTP input | input-otp |
| Images | `next/image` with ImageKit as a remote source |
| Code quality | Biome (format + lint) |

---

## How it works

### Authentication
- The backend sends `accessToken` (1 day) and `refreshToken` (7 days) as **httpOnly cookies**, so JavaScript never touches the tokens.
- `src/lib/apiClient.ts` sends every request with `credentials: "include"`.
- When a request gets `401` (access token expired), the client calls `/auth/refresh-token` **once** and sends the request again. If many requests fail at the same time, they all wait for the same refresh. Auth routes like sign in are skipped, because there `401` means wrong input.
- **`proxy.ts`** runs on the server before a page renders:
  - not signed in → `/`, albums, favorites, trash and profile redirect to `/signin`
  - signed in → `/signin` and `/signup` redirect to `/`
- `proxy.ts` only checks that a token cookie exists. The backend still checks every request.

### Data fetching
- Every API call has its own TanStack Query hook (`useGetMedia`, `useGetAlbums`, `useGetMe` ...).
- Query keys are grouped: `["user"]`, `["media", ...]` (library, trash, stats) and `["albums", ...]`.
- After a change (upload, favorite, trash, restore, delete, album edit), the related keys are invalidated, so every screen and the sidebar storage widget show fresh data without a reload.
- While a new search loads, the previous results stay on screen.

### UI state
- `UIProvider` shares the sidebar, upload modal, create album modal and search text between the navbar, sidebar and pages.

---

## Project structure

```
src/
├── app/
│   ├── (auth)/            signin, signup, otp-verify, forgot-password, reset-password
│   └── (service)/         library (/), albums, albums/[id], favorites, trash, profile
├── api/                   one file per backend module (auth, media, album)
├── hooks/                 TanStack Query hooks for every API
├── components/
│   ├── form/              all forms (TanStack Form)
│   ├── layout/            navbar, sidebar, global modals
│   ├── module/            page sections (photos, album, profile)
│   └── ui/                shadcn/ui components
├── validations/           Zod schemas (same rules as the backend)
├── types/                 TypeScript types for API data
├── utils/                 shared helpers (error message, name initials)
├── lib/                   ofetch client with auto token refresh
├── providers/             TanStack Query provider, UI provider
└── proxy.ts               login redirects
```

---

## Getting started

### Requirements
- Node.js 20 or later
- The [backend](https://github.com/codexmish/Pixtos-Server) running

### Setup

```bash
git clone https://github.com/codexmish/Pixtos-Client.git
cd Pixtos-Client
npm install
```

Create a `.env` file in the root:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8000/api/v1
```

> `NEXT_PUBLIC_*` values are written into the code at build time. Set the real backend URL **before** `npm run build` when you deploy, and restart the dev server after changing it.

Images come from ImageKit. If you use your own ImageKit account, change the `pathname` under `images.remotePatterns` in `next.config.ts` to your ImageKit id.

Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Check code with Biome |
| `npm run format` | Format code with Biome |

---

## Coming in v2

- Ask before deleting permanently or emptying the trash
- Go back to the page you were on after signing in
- Unfavorite many items at once
- Pagination / infinite scroll for big libraries
- A Next.js rewrite for `/api/v1`, so cookies stay first-party when the frontend and backend are on different domains
- Remove avatar and delete account
- Log out from all devices after a password change

---

## Author

**Majharul Islam Shanto**
- GitHub: [@codexmish](https://github.com/codexmish)
- LinkedIn: https://www.linkedin.com/in/majharulislamshanto/
