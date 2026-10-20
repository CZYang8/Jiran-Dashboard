import { NextResponse } from "next/server";
import type { Condition } from "./weather-types";

export const OPENWEATHER_URL = "https://api.openweathermap.org";

type RequestParams =
  | { ok: true; key: string; lat: number; lon: number }
  | { ok: false; response: NextResponse };

/**
 * Reads the API key from .env.local and the location from the request
 * (?lat=...&lon=...), falling back to WEATHER_LAT / WEATHER_LON.
 * Used by both /api/weather and /api/forecast.
 */
export function readRequest(request: Request): RequestParams {
  const key = process.env.OPENWEATHER_API_KEY;
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat") ?? process.env.WEATHER_LAT);
  const lon = Number(searchParams.get("lon") ?? process.env.WEATHER_LON);

  if (!key) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Weather is not configured" },
        { status: 500 }
      ),
    };
  }

  const validCoords =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180;

  if (!validCoords) {
    return {
      ok: false,
      response: NextResponse.json({ error: "No valid location" }, { status: 400 }),
    };
  }

  return { ok: true, key, lat, lon };
}

// Maps OpenWeather's "main" group to the four icons the app has
export function toCondition(main: string): Condition {
  if (main === "Thunderstorm") return "thunderstorm";
  if (main === "Rain" || main === "Drizzle") return "rainy";
  if (main === "Clear") return "sunny";
  return "cloudy"; // Clouds, Mist, Haze, etc.
}
