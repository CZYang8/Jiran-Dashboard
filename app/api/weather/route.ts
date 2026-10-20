import { NextResponse } from "next/server";
import { OPENWEATHER_URL, readRequest } from "../../lib/openweather";
import type { CurrentWeather } from "../../lib/weather-types";

export async function GET(request: Request) {
  const params = readRequest(request);
  if (!params.ok) return params.response;
  const { key, lat, lon } = params;

  const url = `${OPENWEATHER_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;

  try {
    // Cache for 10 minutes so we don't call OpenWeather on every page load
    const res = await fetch(url, { next: { revalidate: 600 } });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Weather service error" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const body: CurrentWeather = {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main, // Clear, Clouds, Rain, Thunderstorm...
    };
    return NextResponse.json(body);
  } catch {
    return NextResponse.json(
      { error: "Could not reach weather service" },
      { status: 502 }
    );
  }
}
