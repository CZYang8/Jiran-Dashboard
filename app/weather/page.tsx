"use client";

import Image from "next/image";
import Link from "next/link";
import { useWeather } from "../hooks/use-weather";
import type { Condition, Forecast } from "../lib/weather-types";

const BackIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M10 8V4l-8 8 8 8v-4.1c5.6 0 9.5 1.8 12 5.6-1-6-4.6-10.9-12-11.5z" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 24 24"
    fill="#c9ccd1"
    aria-hidden="true"
  >
    <path d="M21 12.8A9 9 0 1 1 11.200 3a7 7 0 0 0 9.800 9.800z" />
  </svg>
);

const DropIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#1d8fe1"
    aria-hidden="true"
  >
    <path d="M12 2.500c-3.500 4.600-6 8-6 11.500a6 6 0 0 0 12 0c0-3.500-2.500-6.900-6-11.500z" />
  </svg>
);

/* ---------- Weather condition icons ---------- */

const conditionLabel: Record<Condition, string> = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  thunderstorm: "Thunderstorm",
};

// Shared cloud shape used by the cloudy, rainy and thunderstorm icons
const CloudShape = () => (
  <g fill="#c9ccd1">
    <circle cx="38" cy="50" r="18" />
    <circle cx="60" cy="38" r="24" />
    <circle cx="82" cy="52" r="16" />
    <rect x="26" y="50" width="68" height="20" rx="10" />
  </g>
);

const CloudyIcon = () => (
  <svg
    className="h-[110px] w-[110px]"
    viewBox="0 0 110 114"
    aria-hidden="true"
  >
    <g transform="translate(0 20)">
      <CloudShape />
    </g>
  </svg>
);

const RainyIcon = () => (
  <svg
    className="h-[110px] w-[110px]"
    viewBox="0 0 110 114"
    aria-hidden="true"
  >
    <CloudShape />
    <g stroke="#1d8fe1" strokeWidth="6" strokeLinecap="round">
      <line x1="42" y1="80" x2="36" y2="96" />
      <line x1="60" y1="80" x2="54" y2="96" />
      <line x1="78" y1="80" x2="72" y2="96" />
    </g>
  </svg>
);

const ThunderstormIcon = () => (
  <svg
    className="h-[110px] w-[110px]"
    viewBox="0 0 110 114"
    aria-hidden="true"
  >
    <CloudShape />
    <polygon
      points="64,70 46,94 58,94 52,112 78,84 65,84 74,70"
      fill="#fcaf17"
    />
  </svg>
);

const WeatherIcon = ({ condition }: { condition: Condition }) => {
  switch (condition) {
    case "sunny":
      return (
        <Image
          className="h-[110px] w-[110px] object-contain"
          width={110}
          height={110}
          alt=""
          src="/weather-sun-1@2x.png"
        />
      );
    case "cloudy":
      return <CloudyIcon />;
    case "rainy":
      return <RainyIcon />;
    case "thunderstorm":
      return <ThunderstormIcon />;
  }
};

export default function WeatherPage() {
  // Live forecast: device location -> /api/forecast, refreshed every 10 minutes
  const { data, loading, error } = useWeather<Forecast>("/api/forecast");
  const today = data?.today;
  const days = data?.days ?? [];

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f7f9f6] text-[#0b1322] [font-family:Metropolis,ui-sans-serif,system-ui,sans-serif]">
      {/* Top colour bar */}
      <div className="grid h-4 w-full grid-cols-4">
        <div className="bg-[#d71920]" />
        <div className="bg-[#f15a22]" />
        <div className="bg-[#f58220]" />
        <div className="bg-[#fcaf17]" />
      </div>

      <main className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-4">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <h1 className="m-0 text-4xl font-bold md:text-5xl">View Weather</h1>

          <Link
            href="/"
            className="flex cursor-pointer items-center gap-2 rounded-[20px] border border-[#e6e4df] bg-white px-8 py-4 text-xl font-bold text-[#0b1322] no-underline hover:border-[#ccc9c7] hover:bg-[#e6e6e6] md:text-2xl"
          >
            <BackIcon />
            Back
          </Link>
        </header>

        {/* Forecast row: scrolls sideways when the cards don't fit */}
        <section className="flex flex-1 snap-x gap-4 overflow-x-auto pb-2">
          {/* Today by day, Tonight after sunset */}
          <article className="flex min-h-[380px] w-[260px] shrink-0 snap-start flex-col justify-between rounded-[30px] bg-[#0b1322] p-6 text-white">
            <h2 className="m-0 text-lg font-semibold text-[#c9ccd1]">
              {today?.isNight ? "Tonight" : "Today"}
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex h-[110px] items-center">
                {today?.isNight ? (
                  <MoonIcon />
                ) : today ? (
                  <WeatherIcon condition={today.condition} />
                ) : null}
              </div>
              <p className="m-0 text-7xl font-bold">
                {today ? `${today.temp}°C` : "--°C"}
              </p>
              <p className="m-0 text-base text-[#c9ccd1]">
                High {today?.high ?? "--"}° &nbsp; Low {today?.low ?? "--"}°
                &nbsp; Rain {today?.rain ?? "--"}%
              </p>
            </div>
          </article>

          {/* Status message while loading or when nothing could be loaded */}
          {days.length === 0 && (
            <p className="m-0 flex min-h-[380px] w-[260px] shrink-0 items-center justify-center rounded-[30px] border border-[#e6e4df] bg-white p-6 text-center text-xl text-[#777]">
              {loading
                ? "Loading forecast..."
                : error
                  ? "Couldn't load the forecast. Please try again later."
                  : "No forecast available."}
            </p>
          )}

          {/* Upcoming days (up to 6) */}
          {days.map((d) => (
            <article
              key={d.date}
              className="flex min-h-[380px] w-[260px] shrink-0 snap-start flex-col items-center justify-between rounded-[30px] border border-[#e6e4df] bg-white px-4 py-6 text-center"
            >
              <div>
                <h2 className="m-0 text-2xl font-bold">{d.day}</h2>
                <p className="m-0 mt-1 text-base text-[#777]">{d.date}</p>
              </div>

              <div role="img" aria-label={conditionLabel[d.condition]}>
                <WeatherIcon condition={d.condition} />
              </div>

              <div>
                <p className="m-0 text-4xl font-bold">{d.high}°C</p>
                <p className="m-0 text-2xl font-semibold text-[#777]">
                  {d.low}°C
                </p>
                <p className="m-0 mt-2 flex items-center justify-center gap-1 text-xl font-bold text-[#1d8fe1]">
                  <DropIcon />
                  {d.rain}%
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
