import {
  Baby, Bell, Bike, Bus, Cake, Camera, Car, Church, Clock, Cross, Flower2, Gem,
  Gift, GlassWater, Guitar, Heart, Hotel, Landmark, MapPin, Martini, Mic, Moon,
  Music, PartyPopper, Plane, Salad, Ship, Sparkles, Sun, TreePine, Users, Utensils,
  UtensilsCrossed, Wine, type LucideIcon,
} from "lucide-react";

/**
 * A schedule icon can be any of four things, resolved in this order:
 *   1. an image URL — from an online icon library, or uploaded from the
 *      admin's device (see useImageUpload; uploaded icons live on the
 *      couple's own storage, pasted URLs are fetched from that third party)
 *   2. one of the curated lucide names below (statically bundled)
 *   3. any pasted emoji
 *   4. nothing → a Clock, so a card is never iconless
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

export const isIconUrl = (v: string) => /^(https?:\/\/|data:image\/|blob:)/i.test(v.trim());

/**
 * `size` is the optical box in px. Icons are sized to sit with the text
 * they head — roughly the cap height of the title — rather than floating
 * as an oversized ornament.
 */
export function ScheduleIcon({ name, size = 24 }: { name: string; size?: number }) {
  const value = name.trim();

  if (isIconUrl(value)) {
    return (
      <img
        src={value}
        alt=""
        loading="lazy"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="schedule-icon-img object-contain"
      />
    );
  }

  const Ico = SCHEDULE_ICONS[value.toLowerCase()];
  if (Ico) return <Ico size={size} strokeWidth={1.75} aria-hidden />;

  if (value) {
    return (
      <span aria-hidden style={{ fontSize: size * 0.92, lineHeight: 1 }}>
        {value}
      </span>
    );
  }

  return <Clock size={size} strokeWidth={1.75} aria-hidden />;
}
