# Tentwenty Assignment

A React Native movie app built on the [TMDB API](https://developer.themoviedb.org/docs): browse
upcoming films, search by title or genre, watch trailers full screen and book cinema seats.

Built with React Native 0.87 (New Architecture), TypeScript, React Navigation 7, TanStack Query 5
and FlashList 2.

## Setup

Requires Node 22.11+ and a working [React Native environment](https://reactnative.dev/docs/set-up-your-environment).

```sh
npm install
cd ios && bundle install && bundle exec pod install && cd ..
```

### TMDB API key


1. Create a free account and open [TMDB API settings](https://www.themoviedb.org/settings/api).
2. Copy the template and fill in **one** of the two credentials
   ([TMDB auth docs](https://developer.themoviedb.org/docs/authentication-application)):

   ```sh
   cp .env.example .env
   ```

   | Variable            | Required         | TMDB name             | Sent as                   |
   | ------------------- | ---------------- | --------------------- | ------------------------- |
   | `TMDB_ACCESS_TOKEN` | one of these two | API Read Access Token | `Authorization: Bearer`   |
   | `TMDB_API_KEY`      | one of these two | API Key               | `api_key` query parameter |
   | `TMDB_BASE_URL`     | no               |                       | Defaults to `https://api.themoviedb.org/3` |

   If both credentials are set, the access token wins: headers stay out of URLs, which are more
   likely to end up in logs.


## .env
<!-- TMDB_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNWU1YjhjNjJkMjk5Mjc3ZTMzYTNhMGI3MjdjYjU0YSIsIm5iZiI6MTc5MDY3NjE4NS4zNTY5OTk5LCJzdWIiOiI2YWJiOGNkOTU0ZDExZTk5Yjc4MGIzODgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jyGUmafvRawlZGtTovcgD1UiKbmjqVayoIAp1WFO5FE

TMDB_API_KEY=a5e5b8c62d299277e33a3a0b727cb54a

BASE_URL=https://api.themoviedb.org/3 -->

## Run

```sh
npm run start:clean   # first run, or after changing .env
npm run ios           # or: npm run android
```

| Script                | Purpose                              |
| --------------------- | ------------------------------------ |
| `npm start`           | Start Metro                          |
| `npm run start:clean` | Start Metro with a cleared cache     |
| `npm run ios`         | Build and run on the iOS simulator   |
| `npm run android`     | Build and run on an Android emulator |
| `npm test`            | Unit tests (Jest)                    |
| `npm run lint`        | ESLint                               |
