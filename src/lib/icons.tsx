import {
  Baby, Bell, Bike, Bus, Cake, Camera, Car, Church, Clock, Cross, Flower2, Gem,
  Gift, GlassWater, Guitar, Heart, Hotel, Landmark, MapPin, Martini, Mic, Moon,
  Music, PartyPopper, Plane, Salad, Ship, Sparkles, Sun, TreePine, Users, Utensils,
  UtensilsCrossed, Wine, type LucideIcon,
} from "lucide-react";

/**
 * Curated, statically-bundled icon set for schedule items — the admin picks a
 * name (with live preview) or pastes ANY emoji, which renders as-is. This is
 * the free/no-CDN answer to "any icon": lucide's DynamicIcon would code-split
 * ~1500 chunks and an icon CDN (Iconify) would add a third-party request for
 * guests — both rejected; emoji already covers the arbitrary case for 0 bytes.
 */
export const SCHEDULE_ICONS: Record<string, LucideIcon> = {
  church: Church, rings: Gem, heart: Heart, sparkles: Sparkles, flower: Flower2,
  camera: Camera, car: Car, bus: Bus, bike: Bike, plane: Plane, ship: Ship,
  dinner: UtensilsCrossed, lunch: Utensils, salad: Salad, cake: Cake,
  wine: Wine, cocktail: Martini, toast: GlassWater, music: Music, guitar: Guitar,
  mic: Mic, party: PartyPopper, gift: Gift, hotel: Hotel, landmark: Landmark,
  pin: MapPin, tree: TreePine, sun: Sun, moon: Moon, clock: Clock, bell: Bell,
  guests: Users, baby: Baby, cross: Cross,
};

export const SCHEDULE_ICON_NAMES = Object.keys(SCHEDULE_ICONS).sort();

/** Renders a curated icon, a pasted emoji, or the Clock fallback. */
export function ScheduleIcon({ name, size = 18 }: { name: string; size?: number }) {
  const key = name.trim().toLowerCase();
  const Ico = SCHEDULE_ICONS[key];
  if (Ico) return <Ico size={size} aria-hidden />;
  if (name.trim()) {
    return (
      <span aria-hidden style={{ fontSize: size, lineHeight: 1 }}>
        {name.trim()}
      </span>
    );
  }
  return <Clock size={size} aria-hidden />;
}
