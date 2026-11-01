# Learn Hub Frontend

React + Vite frontend for the Learn Hub Express API.

## Run locally

1. Start your MongoDB database and backend API.
2. In this folder, install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set the API URL:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

   Open http://localhost:5173.

## Backend CORS

Install `cors` and `cookie-parser` in your backend:

```bash
npm install cors cookie-parser
```

Copy the middleware configuration from `backend-cors-snippet.js` into `src/app.js`.
It must be registered before your routes. Keep `credentials: true`; the frontend uses
Axios `withCredentials: true` so the browser sends the HTTP-only JWT cookie.

For production, replace the local frontend origins with your exact deployed frontend
origin. Do not use `origin: "*"` with credentialed cookies.

## Important backend integration notes

- The README documents login as returning only `{ "message": "login successfully" }`.
  The frontend therefore asks the user to select Student or Teacher at login and stores
  that role as a UI hint. This is not trusted authorization: your backend middleware must
  continue enforcing the actual role on every protected endpoint.
- For a production-ready experience, add `GET /api/auth/me` that reads the token cookie
  and returns the authenticated user's safe public fields (for example `{ "user": {
  "id": "...", "username": "...", "role": "student" } }`). Then load the session from
  that endpoint instead of relying on the selected role.
- Add `POST /api/auth/logout` to clear the `token` cookie using the same cookie options
  used when setting it. The current sign-out button clears the frontend role hint only;
  it cannot remove an HTTP-only cookie by itself.
- The course list endpoint is expected to return `{ "courses": [...] }`; enrollment list
  likewise returns `{ "courses": [...] }`. The review list is expected to return
  `{ "reviews": [...] }`. The UI also accepts `{ "course": ... }` for course details.
- Review author display supports `review.user.username` or `review.username`. Adjust
  this mapping if your API returns a different populated field.
- The frontend assumes course IDs are exposed as `_id` or `id`.

## Project structure

```text
learn-hub-frontend/
├── backend-cors-snippet.js
├── index.html
├── package.json
├── .env.example
└── src/
    ├── api.js
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```
