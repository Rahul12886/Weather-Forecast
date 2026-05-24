# Nimbus Weather Dashboard

A modern React weather forecast web app built with Vite, Tailwind CSS, Framer Motion, React Icons, Recharts, React Router, and live Open-Meteo weather APIs.

## Features

- Current weather: temperature, condition, humidity, wind, pressure, feels like, visibility, UV, sunrise, sunset, AQI
- City, country, and location search with debounced live autocomplete
- Geolocation weather lookup
- 7-day forecast and 24-hour hourly forecast
- Temperature, humidity, wind, and rain probability charts
- Favorites, dark/light mode, unit conversion, multi-language weather responses
- Weather alerts, AI-style weather insight, voice search, and weather map tile
- PWA manifest and service worker offline shell caching
- Responsive glassmorphism dashboard UI

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the app:

```bash
npm run dev
```

Open the local Vite URL shown in the terminal.

## API Guide

No weather API key is required. The app uses public [Open-Meteo](https://open-meteo.com/) endpoints for:

- Geocoding search for typed locations
- Forecast API for current, hourly, and 7-day weather
- Air Quality API for AQI, PM2.5, PM10, and ozone

If the live API is unreachable, the app falls back to demo weather data so the UI remains usable.

## Deployment

### Vercel

1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Use build command `npm run build` and output directory `dist`.
4. Deploy.

### Netlify

1. Push the project to GitHub.
2. Create a new Netlify site from the repo.
3. Use build command `npm run build` and publish directory `dist`.
4. Deploy.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
