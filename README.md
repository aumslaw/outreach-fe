# outreach-fe

The web front end for [outreach-bot](https://github.com/zagnu-labs/outreach-bot). It shows one X or Instagram DM at a time; a person sends it by hand and marks it sent, skipped or failed. All data lives in the backend.

## Run

```
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_ZAGNU_GO_API_URL` | API base URL, default `https://api.zagnu.com`. Calls go to `<base>/public/outreach`. |

The backend must list this site's origin in its `CORS_ORIGINS`.

## Signing in

The login link is `https://<this site>/access#<ACCESS_TOKEN>`. The token is after `#`, so it never reaches a server or its logs. The page trades it for a session, asks for a name, and stores the session in the browser. Changing `ACCESS_TOKEN` on the backend logs everyone out.

If the backend has `WEB_USERS` or `WEB_PASSWORD` set, `/login` shows a password form instead.
