# Blog Frontend (Next.js + Tailwind)

Frontend for a simple blog application built with Next.js (App Router), React, and Tailwind CSS.
It connects to a Flask + SQLAlchemy backend API and supports

- Listing blog posts
- Viewing a post detail page
- Creating a new post
- Paginated navigation

---

## Live Demo

- **Frontend (Vercel):** https://blog-frontend-two-pink.vercel.app
- **Backend (Heroku):** https://flasker60-6ecec4d890e9.herokuapp.com

---

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Fetch API

---

## Project Structure

```text
src/
  app/
    page.js                # Home page (list posts)
    posts/
      [id]/
        page.js            # Post detail page
    new/
      page.js              # Create new post
```

---

## Pagination

The home page consumes the backend pagination API.

- Uses page and limit query parameters
- Displays a fixed number of posts per page
- Enables **Next / Previous** navigation based on API response

Pagination logic is handled by the backend and reflected in the UI.

---

## Backend API Requirements

This frontend expects the backend to expose the following endpoints:

- `GET /posts` – list posts (supports pagination)
- `GET /posts/<id>` – retrieve a single post
- `POST /posts` – create a new post

Example response:

```json
{
  "id": 1,
  "title": "My first post",
  "content": "Hello world",
  "created_at": "2025-12-12T16:09:52Z",
  "updated_at": "2025-12-12T16:09:52Z"
}
```

---

## Getting Started (Local Development)
### 1. Install dependencies
```bash
npm install
```
### 2. Create environment file

Create a file named .env.local in the project root:
```bash
NEXT_PUBLIC_API_BASE=http://127.0.0.1:5001
```

Update the port if your backend runs on a different port.

### 3. Run the development server

```bash
npm run dev
```

Open your browser at:

```
http://localhost:3000
```

---
## Deployment (Vercel)

### Initial Deployment

1. Push the project to a public GitHub repository
2. Open the Vercel Dashboard and import the repository
3. Set the following environment variable in Vercel:

```bash
NEXT_PUBLIC_API_BASE=https://REPLACE_WITH_YOUR_HEROKU_APP.herokuapp.com
```
4. Click Deploy.

Vercel will automatically build and deploy the application.

---

## Updating the Deployment

Any push to the main branch triggers an automatic redeployment on Vercel:

```bash
git add .
git commit -m "Update frontend"
git push origin main
```
No manual redeploy is required.



