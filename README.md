# Learn Hub API

A Node.js and Express API for registering and logging in users and managing courses. It uses MongoDB through Mongoose and authenticates protected requests with a JWT stored in a cookie.

## Project Description

Learn Hub is a backend API for an online learning platform. It supports student and teacher accounts, teacher-managed course creation and updates, student course enrollment, and course reviews. Students can browse courses, enroll in courses, and review courses they are enrolled in; teachers can manage course listings. Protected endpoints use cookie-based JWT authentication, and MongoDB with Mongoose stores users, courses, enrollments, and reviews.

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
   CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```

   Set `MONGO_URI` to your MongoDB connection string. Use a private, sufficiently strong value for `SECRET_KEY`; do not commit `.env`. `CORS_ORIGINS` is a comma-separated list of trusted frontend origins.

3. Start the server:

   ```bash
   node server.js
   ```

   The API listens on `http://localhost:3000`.

4. In a separate terminal, install and start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The frontend runs at `http://localhost:5173` and calls the API at `http://localhost:3000`. To use another API URL, set `VITE_API_URL` in `frontend/.env` (see [frontend/.env.example](./frontend/.env.example)). API calls include credentials so the authentication cookie is sent.

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

Allowed roles are `student` and `teacher`; if omitted, the database model defaults the role to `student`. A successful registration returns HTTP `201` with a `message`; an existing username returns HTTP `409`.

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
  "message": "login successfully",
  "user": {
    "username": "alex",
    "role": "student"
  }
}
```

The response also sets a `token` cookie. Keep and send this cookie with requests to protected endpoints. Invalid credentials return HTTP `401`.

### Log out

`POST /api/auth/logout` — clears the `token` cookie.

### Add a course

`POST /api/courses/` — requires the `token` cookie and a user with the `teacher` role.

```json
{
  "title": "Introduction to Biology",
  "description": "A beginner-friendly overview of biology.",
  "instructor": "Alex Smith",
  "category": "Science",
  "price": 49
}
```

On success, the API returns HTTP `201` with a `message` and the created `course`. Missing or invalid authentication returns HTTP `401`; a user without the teacher role returns HTTP `403`.
The course's `createdAt` timestamp is set automatically.

### List courses

`GET /api/courses/` — returns all courses in a `courses` array. No authentication is required.

### Get a course

`GET /api/courses/:id` — returns the matching `course`. No authentication is required. An invalid ID returns HTTP `400`; a course that does not exist returns HTTP `404`.

### Update a course

`PUT /api/courses/:id` — requires the `token` cookie and a user with the `teacher` role. Send any fields to update; `price` must be an integer. The `createdAt` timestamp is set when the course is created and cannot be changed through this endpoint.

```json
{
  "title": "Updated course title",
  "description": "Updated course description.",
  "instructor": "Alex Smith",
  "category": "Science",
  "price": 59
}
```

On success, the API returns the updated `course`. Invalid IDs return HTTP `400`, and missing courses return HTTP `404`.

### Delete a course

`DELETE /api/courses/:id` — requires the `token` cookie and a user with the `teacher` role. On success, the API returns a confirmation `message` and the deleted `course`. Invalid IDs return HTTP `400`, and missing courses return HTTP `404`.

### Enroll in a course

`POST /api/enrollments/:courseId` — requires the `token` cookie and a user with the `student` role. No request body is required. On success, the API returns HTTP `201` with the created `enrollment`. Invalid course IDs return HTTP `400`, courses that do not exist return HTTP `404`, and duplicate enrollments return HTTP `409`.

### List my courses

`GET /api/enrollments/my-courses` — requires the `token` cookie and a user with the `student` role. Returns the student's enrolled courses in a `courses` array.

### Add a course review

`POST /api/courses/:courseId/reviews` — requires the `token` cookie and a student account enrolled in the course. Send a rating from 1 to 5 and a comment:

```json
{
  "rating": 5,
  "comment": "Clear explanations and useful exercises."
}
```

Each student may leave one review per course. A successful request returns HTTP `201` with the created `review`; invalid course IDs return HTTP `400`, missing courses return HTTP `404`, and duplicate reviews return HTTP `409`.

### Get course reviews

`GET /api/courses/:courseId/reviews` — returns the course's reviews in a `reviews` array, newest first. No authentication is required.

### Update a review

`PUT /api/reviews/:reviewId` — requires the `token` cookie and the student role. Only the review's author can update it. Send either or both `rating` and `comment` fields.

### Delete a review

`DELETE /api/reviews/:reviewId` — requires the `token` cookie and the student role. Only the review's author can delete it.

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
