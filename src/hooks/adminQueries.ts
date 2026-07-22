import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { data } from "../services/data";
import type {
  Embed,
  EventDoc,
  FaqItem,
  GalleryImage,
  Gift,
  Guest,
  Hotel,
  Message,
  Photo,
  PlusOneRequest,
  Promo,
  ScheduleItem,
  Settings,
  WeatherSettings,
} from "../types";

export function useAdminGuests(eventId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "guests", eventId],
    queryFn: () => data.adminListGuests(eventId!),
    enabled: !!eventId,
  });
}

export function useAdminRsvps(eventId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "rsvps", eventId],
    queryFn: () => data.adminListRsvps(eventId!),
    enabled: !!eventId,
  });
}

export function useAdminPlusOnes(eventId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "plusOnes", eventId],
    queryFn: () => data.adminListPlusOnes(eventId!),
    enabled: !!eventId,
  });
}

/**
 * Invalidate ONLY what a mutation actually changed.
 *
 * This previously called `invalidateQueries()` with no key, which marks every
 * query in the cache stale — so saving one guest refetched the event,
 * schedule, hotels, FAQ, gallery, messages, settings, weather, guests, RSVPs
 * and plus-ones, a dozen round trips for a one-document write. Keys are
 * matched by prefix, so ["admin","guests"] covers ["admin","guests",eventId].
 */
function useAdminMutation<T>(fn: (v: T) => Promise<void>, keys: string[][]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      for (const key of keys) void qc.invalidateQueries({ queryKey: key });
    },
  });
}

type Ref = { eventId: string; id: string };

/* guests — the guest list, the per-guest detail the site reads, and (on
   delete) the RSVP that goes with them */
export const useSaveGuest = () =>
  useAdminMutation<Guest>((g) => data.adminSaveGuest(g), [["admin", "guests"], ["guest"]]);
export const useDeleteGuest = () =>
  useAdminMutation<Ref>((v) => data.adminDeleteGuest(v.eventId, v.id), [
    ["admin", "guests"],
    ["guest"],
    ["admin", "rsvps"],
  ]);

/* plus-ones — approving also mints a guest, so refresh both lists */
export const useSavePlusOne = () =>
  useAdminMutation<PlusOneRequest>((p) => data.adminSavePlusOne(p), [
    ["admin", "plusOnes"],
    ["plusOnes"],
    ["admin", "guests"],
  ]);

export const useSaveEvent = () =>
  useAdminMutation<EventDoc>((e) => data.adminSaveEvent(e), [["event"]]);
export const useSaveSettings = () =>
  useAdminMutation<Settings>((s) => data.adminSaveSettings(s), [["settings"]]);
export const useSaveWeatherSettings = () =>
  useAdminMutation<WeatherSettings>((w) => data.adminSaveWeatherSettings(w), [
    ["weatherSettings"],
    ["forecast"],
  ]);

export const useSaveScheduleItem = () =>
  useAdminMutation<ScheduleItem>((i) => data.adminSaveScheduleItem(i), [["schedule"]]);
export const useDeleteScheduleItem = () =>
  useAdminMutation<Ref>((v) => data.adminDeleteScheduleItem(v.eventId, v.id), [["schedule"]]);

export const useSaveHotel = () =>
  useAdminMutation<Hotel>((h) => data.adminSaveHotel(h), [["hotels"]]);
export const useDeleteHotel = () =>
  useAdminMutation<Ref>((v) => data.adminDeleteHotel(v.eventId, v.id), [["hotels"]]);

export const useSaveFaq = () => useAdminMutation<FaqItem>((f) => data.adminSaveFaq(f), [["faq"]]);
export const useDeleteFaq = () =>
  useAdminMutation<Ref>((v) => data.adminDeleteFaq(v.eventId, v.id), [["faq"]]);

export const useSaveGalleryImage = () =>
  useAdminMutation<GalleryImage>((g) => data.adminSaveGalleryImage(g), [["gallery"]]);
export const useDeleteGalleryImage = () =>
  useAdminMutation<Ref>((v) => data.adminDeleteGalleryImage(v.eventId, v.id), [["gallery"]]);

export const useSaveMessage = () =>
  useAdminMutation<Message>((m) => data.adminSaveMessage(m), [["messages"]]);
export const useDeleteMessage = () =>
  useAdminMutation<Ref>((v) => data.adminDeleteMessage(v.eventId, v.id), [["messages"]]);

export const useSaveGift = () =>
  useAdminMutation<Gift>((g) => data.adminSaveGift(g), [["gifts"]]);
export const useDeleteGift = () =>
  useAdminMutation<Ref>((v) => data.adminDeleteGift(v.eventId, v.id), [["gifts"]]);

export const useSavePromo = () =>
  useAdminMutation<Promo>((p) => data.adminSavePromo(p), [["promos"]]);
export const useDeletePromo = () =>
  useAdminMutation<Ref>((v) => data.adminDeletePromo(v.eventId, v.id), [["promos"]]);

export const useSaveEmbed = () =>
  useAdminMutation<Embed>((e) => data.adminSaveEmbed(e), [["embeds"]]);
export const useDeleteEmbed = () =>
  useAdminMutation<Ref>((v) => data.adminDeleteEmbed(v.eventId, v.id), [["embeds"]]);

/* photos — approving one copies it into the public gallery */
export const useSavePhoto = () =>
  useAdminMutation<Photo>((p) => data.adminSavePhoto(p), [
    ["admin", "photos"],
    ["gallery"],
    ["myPhotos"],
  ]);
export const useDeletePhoto = () =>
  useAdminMutation<Ref>((v) => data.adminDeletePhoto(v.eventId, v.id), [
    ["admin", "photos"],
    ["myPhotos"],
  ]);
