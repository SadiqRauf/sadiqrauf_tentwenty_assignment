# Tentwenty Assignment

A React Native app that lists upcoming movies from TMDB and plays their trailers.

## Setup

Requires Node 22.11+ and a working [React Native environment](https://reactnative.dev/docs/set-up-your-environment).

```sh
npm install
cd ios && bundle install && bundle exec pod install && cd ..
```

### TMDB API key

The app reads its credentials from a **local `.env` file** at build time, via
[`react-native-dotenv`](https://github.com/goatandsheep/react-native-dotenv). The file is
gitignored, so the key is never committed.

1. Create a free account and open [TMDB API settings](https://www.themoviedb.org/settings/api).
2. Copy the template and set **one** of the two credentials
   ([TMDB auth docs](https://developer.themoviedb.org/docs/authentication-application)):

   ```sh
   cp .env.example .env
   ```

   | Variable            | TMDB name              | Sent as                   |
   | ------------------- | ---------------------- | ------------------------- |
   | `TMDB_ACCESS_TOKEN` | API Read Access Token  | `Authorization: Bearer`   |
   | `TMDB_API_KEY`      | API Key                | `api_key` query parameter |

   If both are set the access token wins: headers stay out of URLs, which are more
   likely to end up in logs.

3. Start Metro with a clean cache (see below).

The app only reads credentials through [`src/config/env.ts`](src/config/env.ts), which logs
a warning in development if neither is set.

> **Changed `.env` or `babel.config.js`?** Values are inlined when Babel transforms the
> code, and Metro caches those transforms. Restart Metro with `npm run start:clean`,
> otherwise it keeps serving the old values (or fails with `Unable to resolve module @env`).

## Run

```sh
npm run start:clean   # first run, or after changing .env
npm run ios           # or: npm run android
```

## Scripts

| Script                | Purpose                               |
| --------------------- | ------------------------------------- |
| `npm start`           | Start Metro                           |
| `npm run start:clean` | Start Metro with a cleared cache      |
| `npm run ios`         | Build and run on the iOS simulator    |
| `npm run android`     | Build and run on an Android emulator  |
| `npm test`            | Unit tests (Jest)                     |
| `npm run lint`        | ESLint                                |
