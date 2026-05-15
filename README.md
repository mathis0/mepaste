# mepaste 🍅

*one person · one textarea · one short link.*

A tiny indie-web pastebin. No signup, no ads, no analytics. Your paste **ripens for as long as you said it would, and then it goes away.**

## the three promises

- no trackers, no ads, no fingerprints
- your paste wilts when you said it would
- deletion means deletion

## stack

- backend — FastAPI + SQLAlchemy (async) + Postgres
- frontend — React + Vite + TypeScript
- everything dockerized

## run it

```sh
cp .env.example .env
docker compose up --build
```

Then open <http://localhost:5173>. Backend is at <http://localhost:8000>.

## features

- create paste with title + content + language
- visibility: public / unlisted / private
- expiration: 1 hour · a day · never
- password protect
- burn after first read
- raw view link & copy short URL
- "my pastes" list (per-browser, via owner token)
- english · فارسی (full RTL)

— nima · tehran · mmxxvi
