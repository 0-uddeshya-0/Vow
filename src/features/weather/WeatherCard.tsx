import { CloudRain, CloudSun, Snowflake, Sun, Wind, Zap, Sunrise, Sunset } from "lucide-react";
import { useI18n } from "../../i18n";
import { GlassCard } from "../../components/ui/GlassCard";
import { Skeleton } from "../../components/ui/Skeleton";
import { entrance } from "../../animations/variants";
import { weatherKey, type DayForecast } from "../../services/weather";

const icons = { clear: Sun, cloudy: CloudSun, rain: CloudRain, snow: Snowflake, storm: Zap };

export function WeatherCard({
  forecast,
  loading,
  failed,
}: {
  forecast: DayForecast | null | undefined;
  loading: boolean;
  failed: boolean;
}) {
  const { t } = useI18n();

  if (loading) {
    return (
      <GlassCard className="p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-4 h-10 w-28" />
        <Skeleton className="mt-4 h-5 w-56" />
      </GlassCard>
    );
  }
  // Silent failure would be worse than saying nothing at all.
  if (failed || !forecast) return null;

  const key = weatherKey(forecast.code);
  const Icon = icons[key];

  return (
    <GlassCard className="p-6" {...entrance()}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">{t.weather.title}</p>
          <p className="mt-2 font-display text-2xl text-ink">{t.weather[key]}</p>
        </div>
        <Icon size={34} className="shrink-0 text-gold-ink" aria-hidden />
      </div>

      <p className="tnum mt-3 font-display text-4xl text-ink">
        {forecast.tMax}°<span className="text-2xl text-ink-soft"> / {forecast.tMin}°</span>
      </p>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
        <span className="tnum inline-flex items-center gap-1.5">
          <CloudRain size={14} aria-hidden /> {forecast.rainChance}% {t.weather.rain}
        </span>
        <span className="tnum inline-flex items-center gap-1.5">
          <Wind size={14} aria-hidden /> {forecast.windMax} km/h
        </span>
        <span className="tnum inline-flex items-center gap-1.5">
          <Sunrise size={14} aria-hidden /> {forecast.sunrise}
        </span>
        <span className="tnum inline-flex items-center gap-1.5">
          <Sunset size={14} aria-hidden /> {forecast.sunset}
        </span>
      </div>
    </GlassCard>
  );
}
