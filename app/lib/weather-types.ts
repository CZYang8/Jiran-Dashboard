export type Condition = "sunny" | "cloudy" | "rainy" | "thunderstorm";

// What /api/weather returns (main page)
export type CurrentWeather = { temp: number; condition: string };

export type ForecastDay = {
  day: string; // "Saturday"
  date: string; // "10 October"
  high: number;
  low: number;
  rain: number; // chance of rain, 0-100
  condition: Condition;
};

// The first card on the weather page: "Today" by day, "Tonight" after sunset
export type Today = {
  temp: number;
  high: number;
  low: number;
  rain: number; // chance of rain, 0-100
  condition: Condition;
  isNight: boolean;
};

// What /api/forecast returns (weather page)
export type Forecast = {
  today: Today;
  days: ForecastDay[];
};
