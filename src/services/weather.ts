/**
 * Open-Meteo — free, no API key, no account, no tracking cookies.
 * Chosen deliberately over keyed providers: the request carries only
 * coordinates the couple published anyway, which keeps the GDPR story clean.
 */
export type DayForecast = {
  date: string;
  tMax: number;
  tMin: number;
  rainChance: number;
  windMax: number;
  sunrise: string;
  sunset: string;
  code: number;
};

export async function fetchForecast(
  lat: number,
  lng: number,
  timezone: string,
  date: string,
): Promise<DayForecast | null> {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lng}` +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min," +
    "precipitation_probability_max,wind_speed_10m_max,sunrise,sunset" +
    `&timezone=${encodeURIComponent(timezone)}&start_date=${date}&end_date=${date}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const j = (await res.json()) as {
    daily?: Record<string, unknown[]>;
  };
  const d = j.daily;
  if (!d || !Array.isArray(d.time) || d.time.length === 0) return null;

  return {
    date: String(d.time[0]),
    code: Number(d.weather_code?.[0] ?? 0),
    tMax: Math.round(Number(d.temperature_2m_max?.[0] ?? 0)),
    tMin: Math.round(Number(d.temperature_2m_min?.[0] ?? 0)),
    rainChance: Math.round(Number(d.precipitation_probability_max?.[0] ?? 0)),
    windMax: Math.round(Number(d.wind_speed_10m_max?.[0] ?? 0)),
    sunrise: String(d.sunrise?.[0] ?? "").slice(11, 16),
    sunset: String(d.sunset?.[0] ?? "").slice(11, 16),
  };
}

/** WMO code → i18n key (kept tiny; groups rather than all 28 codes). */
export function weatherKey(code: number): "clear" | "cloudy" | "rain" | "snow" | "storm" {
  if (code >= 95) return "storm";
  if (code >= 71 && code <= 77) return "snow";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 86)) return "rain";
  if (code >= 2) return "cloudy";
  return "clear";
}
