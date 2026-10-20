import { useEffect, useState } from "react";
import type { CurrentWeather } from "../lib/weather-types";

const REFRESH_MS = 10 * 60 * 1000; // refresh every 10 minutes

/**
 * Gets the device's location, then fetches JSON from `endpoint`
 * (with ?lat=...&lon=... added) and refreshes it every 10 minutes.
 *
 *   useWeather()                           -> current weather (main page)
 *   useWeather<Forecast>("/api/forecast")  -> forecast (weather page)
 *
 * If location is denied or unavailable, the request is sent without
 * coordinates and the server falls back to WEATHER_LAT / WEATHER_LON.
 */
export function useWeather<T = CurrentWeather>(endpoint = "/api/weather") {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let coords: { lat: number; lon: number } | null = null;
    let cancelled = false;

    const load = async () => {
      const query = coords ? `?lat=${coords.lat}&lon=${coords.lon}` : "";
      try {
        const res = await fetch(`${endpoint}${query}`);
        if (!res.ok) throw new Error("Request failed");
        const json = (await res.json()) as T;
        if (!cancelled) {
          setData(json);
          setError(false);
        }
      } catch {
        // keep the last good data, just flag the error
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          coords = {
            lat: Number(pos.coords.latitude.toFixed(2)),
            lon: Number(pos.coords.longitude.toFixed(2)),
          };
          load();
        },
        () => load(), // denied or unavailable: use the .env location
        { timeout: 10000, maximumAge: REFRESH_MS }
      );
    } else {
      load();
    }

    const timer = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [endpoint]);

  return { data, loading, error };
}
