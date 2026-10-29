# Learn Hub API

A Node.js and Express API for registering and logging in users and adding courses. It uses MongoDB through Mongoose and authenticates protected requests with a JWT stored in a cookie.

## Requirements

- Node.js and npm
- A MongoDB database (local or hosted)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/learn-hub
   SECRET_KEY=replace-this-with-a-long-random-secret
   ```

   Set `MONGO_URI` to your MongoDB connection string. Use a private, sufficiently strong value for `SECRET_KEY`; do not commit `.env`.

3. Start the server:

   ```bash
   node server.js
   ```

   The API listens on `http://localhost:3000`.

## API

All request bodies should be JSON.

### Register

`POST /api/auth/register`

```json
{
  "username": "alex",
  "password": "your-password",
  "role": "student"
}
```

Allowed roles are `student` and `teacher`; if omitted, the database model defaults the role to `student`. A successful registration returns `user created successfully`. An existing username returns `user already exist`.

### Log in

`POST /api/auth/login`

```json
{
  "username": "alex",
  "password": "your-password"
}
```

On success, the response is:

```json
{
  "message": "login successfully"
}
```

The response also sets a `token` cookie. Keep and send this cookie with requests to protected endpoints. Invalid credentials return `invalid Credentials`.

### Add a course

`POST /api/courses/add` — requires the `token` cookie and a user with the `teacher` role.

```json
{
  "courseName": "Introduction to Biology",
  "description": "A beginner-friendly overview of biology."
}
```

On success, the response includes a `message` and the created `course`. Missing or invalid authentication returns HTTP `401`; a user without the teacher role also receives HTTP `401`.

## Project structure

```text
server.js
src/
  app.js
  controllers/
  db/
  middlewares/
  models/
  routes/
```

## Tests

The `npm test` script is currently a placeholder; no automated tests are configured.
