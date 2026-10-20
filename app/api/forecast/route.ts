import { NextResponse } from "next/server";
import {
  OPENWEATHER_URL,
  readRequest,
  toCondition,
} from "../../lib/openweather";
import type {
  Condition,
  Forecast,
  ForecastDay,
} from "../../lib/weather-types";
 
const MAX_DAYS = 6;
 
// Read a "local" timestamp (already shifted by the location's UTC offset)
const weekdayOf = (d: Date) =>
  d.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
const dateOf = (d: Date) =>
  d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
 
/* ------------------------------------------------------------------ */
/* Option 1: One Call API 3.0 (8 days). Needs the "One Call by Call"  */
/* subscription on your OpenWeather account (free up to 1,000 calls/  */
/* day, but it asks for card details). Returns null if not available. */
/* ------------------------------------------------------------------ */
 
type OneCallDay = {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: { min: number; max: number };
  pop?: number; // probability of rain, 0-1
  weather: { main: string }[];
};
 
async function fromOneCall(
  key: string,
  lat: number,
  lon: number
): Promise<Forecast | null> {
  const url =
    `${OPENWEATHER_URL}/data/3.0/onecall` +
    `?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${key}`;
 
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) return null;
 
  const data = await res.json();
  const offset: number = data.timezone_offset;
  const daily: OneCallDay[] = data.daily;
  const first = daily[0];
  const now: number = data.current.dt;
 
  const days: ForecastDay[] = daily.slice(1, MAX_DAYS + 1).map((d) => {
    const local = new Date((d.dt + offset) * 1000);
    return {
      day: weekdayOf(local),
      date: dateOf(local),
      high: Math.round(d.temp.max),
      low: Math.round(d.temp.min),
      rain: Math.round((d.pop ?? 0) * 100),
      condition: toCondition(d.weather[0].main),
    };
  });
 
  return {
    today: {
      temp: Math.round(data.current.temp),
      high: Math.round(first.temp.max),
      low: Math.round(first.temp.min),
      rain: Math.round((first.pop ?? 0) * 100),
      condition: toCondition(data.current.weather[0].main),
      isNight: now < first.sunrise || now > first.sunset,
    },
    days,
  };
}
 
/* ------------------------------------------------------------------ */
/* Option 2: free 5-day forecast in 3-hour steps (about 4-5 days).    */
/* ------------------------------------------------------------------ */
 
type ForecastSlot = {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number };
  pop?: number;
  weather: { main: string }[];
};
 
type Slot = {
  dt: number;
  temp: number;
  tempMin: number;
  tempMax: number;
  pop: number;
  condition: Condition;
};
 
// Pick one icon for a whole day
function dayCondition(slots: Slot[]): Condition {
  if (slots.some((s) => s.condition === "thunderstorm" && s.pop >= 0.5)) {
    return "thunderstorm";
  }
  if (slots.some((s) => s.condition === "rainy" && s.pop >= 0.5)) {
    return "rainy";
  }
  const sunny = slots.filter((s) => s.condition === "sunny").length;
  return sunny >= slots.length / 2 ? "sunny" : "cloudy";
}
 
async function fromForecast(
  key: string,
  lat: number,
  lon: number
): Promise<Forecast | null> {
  const url =
    `${OPENWEATHER_URL}/data/2.5/forecast` +
    `?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
 
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) return null;
 
  const data = await res.json();
  const tz: number = data.city.timezone; // seconds offset from UTC
 
  const slots: Slot[] = (data.list as ForecastSlot[]).map((s) => ({
    dt: s.dt,
    temp: s.main.temp,
    tempMin: s.main.temp_min,
    tempMax: s.main.temp_max,
    pop: s.pop ?? 0,
    condition: toCondition(s.weather[0].main),
  }));
 
  const localDate = (dt: number) => new Date((dt + tz) * 1000);
  const dayKey = (dt: number) => localDate(dt).toISOString().slice(0, 10);
  const now = Math.floor(Date.now() / 1000);
  const todayKey = dayKey(now);
 
  // Group the 3-hour slots by local calendar day
  const groups = new Map<string, Slot[]>();
  for (const s of slots) {
    const k = dayKey(s.dt);
    groups.set(k, [...(groups.get(k) ?? []), s]);
  }
 
  const days: ForecastDay[] = [...groups.entries()]
    .filter(([k]) => k !== todayKey)
    .slice(0, MAX_DAYS)
    .map(([, g]) => {
      const local = localDate(g[0].dt);
      return {
        day: weekdayOf(local),
        date: dateOf(local),
        high: Math.round(Math.max(...g.map((s) => s.tempMax))),
        low: Math.round(Math.min(...g.map((s) => s.tempMin))),
        rain: Math.round(Math.max(...g.map((s) => s.pop)) * 100),
        condition: dayCondition(g),
      };
    });
 
  // Rest of today (or the next 12 hours if today has no slots left)
  const todaySlots = groups.get(todayKey) ?? slots.slice(0, 4);
 
  return {
    today: {
      temp: Math.round(slots[0].temp),
      high: Math.round(Math.max(...todaySlots.map((s) => s.tempMax))),
      low: Math.round(Math.min(...todaySlots.map((s) => s.tempMin))),
      rain: Math.round(Math.max(...todaySlots.map((s) => s.pop)) * 100),
      condition: slots[0].condition,
      isNight: now < data.city.sunrise || now > data.city.sunset,
    },
    days,
  };
}
 
export async function GET(request: Request) {
  const params = readRequest(request);
  if (!params.ok) return params.response;
  const { key, lat, lon } = params;
 
  try {
    // 6 days if One Call 3.0 is available, otherwise the free 5-day forecast
    const body =
      (await fromOneCall(key, lat, lon)) ??
      (await fromForecast(key, lat, lon));
 
    if (!body) {
      return NextResponse.json(
        { error: "Weather service error" },
        { status: 502 }
      );
    }
    return NextResponse.json(body);
  } catch {
    return NextResponse.json(
      { error: "Could not reach weather service" },
      { status: 502 }
    );
  }
}
 
