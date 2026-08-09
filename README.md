# LearnFlow — Online Learning Platform

A student-friendly learning platform demo focused on:

- Video lessons and HTML5 media streaming
- User authentication
- Persistent progress tracking
- Quiz assessments
- Responsive UI
- SQLite data storage
- JWT authentication API

## Run

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## Demo login

The current frontend uses local browser authentication for an immediately runnable demo. The Express API also provides production-oriented register/login/progress endpoints.

### API endpoints

- `POST /api/register`
- `POST /api/login`
- `GET /api/progress`
- `POST /api/progress`

## Database

SQLite is created automatically as `learnflow.db`.

Tables:

- `users`
- `progress`

## Video streaming

The frontend uses the HTML5 `<video>` element with MP4 URLs. In a production platform, replace the demo video URLs with your own CDN/object-storage URLs or a protected streaming service.

For large libraries, use HLS/DASH and CDN delivery rather than serving large MP4 files directly from Express.

## Production improvements

- Connect frontend login to the API instead of local demo authentication.
- Store JWT securely (prefer an HTTP-only cookie for browser sessions).
- Add refresh-token/session handling.
- Add role-based access for instructors/admins.
- Store videos in object storage and deliver through a CDN.
- Use HLS/DASH for adaptive streaming.
- Add signed video URLs for protected lessons.
- Add server-side progress synchronization.
- Add rate limiting, validation, CSRF protection where applicable, HTTPS, and secure headers.
