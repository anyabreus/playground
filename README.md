# Playground

This repository is my personal playground.

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## AI map chat

The `/ai-map` page uses Gemini and OpenStreetMap's Nominatim geocoder. Set
`GOOGLE_GENERATIVE_AI_API_KEY` in your environment before starting the app to
enable chat. Place searches are sent to the public Nominatim service and are
subject to its usage policy and rate limits.
