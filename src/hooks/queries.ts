import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ACTIVE_EVENT_SLUG, data } from "../services/data";
import { fetchForecast } from "../services/weather";
import type { Rsvp, PlusOneRequest } from "../types";

export function useEvent() {
  return useQuery({
    queryKey: ["event", ACTIVE_EVENT_SLUG],
    queryFn: () => data.getEventBySlug(ACTIVE_EVENT_SLUG),
    staleTime: 5 * 60_000,
  });
}

export function useSchedule(eventId: string | undefined) {
  return useQuery({
    queryKey: ["schedule", eventId],
    queryFn: () => data.listSchedule(eventId!),
    enabled: !!eventId,
    staleTime: 60_000,
  });
}

export function useGuest(eventId: string | undefined, guestId: string | undefined) {
  return useQuery({
    queryKey: ["guest", eventId, guestId],
    queryFn: () => data.getGuest(eventId!, guestId!),
    enabled: !!eventId && !!guestId,
    staleTime: 5 * 60_000,
  });
}

export function useRsvp(eventId: string | undefined, guestId: string | undefined) {
  return useQuery({
    queryKey: ["rsvp", eventId, guestId],
    queryFn: () => data.getRsvp(eventId!, guestId!),
    enabled: !!eventId && !!guestId,
  });
}

export function useSaveRsvp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rsvp: Rsvp) => data.saveRsvp(rsvp),
    onSuccess: (_r, rsvp) =>
      void qc.invalidateQueries({ queryKey: ["rsvp", rsvp.eventId, rsvp.guestId] }),
  });
}

export function usePlusOneRequests(eventId: string | undefined, guestId: string | undefined) {
  return useQuery({
    queryKey: ["plusOnes", eventId, guestId],
    queryFn: () => data.listPlusOneRequests(eventId!, guestId!),
    enabled: !!eventId && !!guestId,
  });
}

const list = <T,>(key: string, eventId: string | undefined, fn: (id: string) => Promise<T>) => ({
  queryKey: [key, eventId],
  queryFn: () => fn(eventId!),
  enabled: !!eventId,
  staleTime: 60_000,
});

export function useHotels(eventId: string | undefined) {
  return useQuery(list("hotels", eventId, (id) => data.listHotels(id)));
}
export function useFaq(eventId: string | undefined) {
  return useQuery(list("faq", eventId, (id) => data.listFaq(id)));
}
export function useGallery(eventId: string | undefined) {
  return useQuery(list("gallery", eventId, (id) => data.listGallery(id)));
}
export function useMessages(eventId: string | undefined) {
  return useQuery(list("messages", eventId, (id) => data.listMessages(id)));
}
export function useGifts(eventId: string | undefined) {
  return useQuery(list("gifts", eventId, (id) => data.listGifts(id)));
}
export function usePromos(eventId: string | undefined) {
  return useQuery(list("promos", eventId, (id) => data.listPromos(id)));
}
export function useEmbeds(eventId: string | undefined) {
  return useQuery(list("embeds", eventId, (id) => data.listEmbeds(id)));
}
export function useSettings(eventId: string | undefined) {
  return useQuery(list("settings", eventId, (id) => data.getSettings(id)));
}
export function useWeatherSettings(eventId: string | undefined) {
  return useQuery(list("weatherSettings", eventId, (id) => data.getWeatherSettings(id)));
}

/** Forecast only resolves inside the CMS-configured window before the event. */
export function useForecast(
  enabled: boolean,
  lat: number | null | undefined,
  lng: number | null | undefined,
  timezone: string | undefined,
  date: string | undefined,
) {
  return useQuery({
    queryKey: ["forecast", lat, lng, date],
    queryFn: () => fetchForecast(lat!, lng!, timezone!, date!),
    enabled: enabled && lat != null && lng != null && !!timezone && !!date,
    staleTime: 30 * 60_000,
    retry: 1,
  });
}

export function useMyPhotos(eventId: string | undefined, guestId: string | undefined) {
  return useQuery({
    queryKey: ["myPhotos", eventId, guestId],
    queryFn: () => data.listMyPhotos(eventId!, guestId!),
    enabled: !!eventId && !!guestId,
  });
}

export function useCreatePlusOne() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: PlusOneRequest) => data.createPlusOneRequest(req),
    onSuccess: (_r, req) =>
      void qc.invalidateQueries({ queryKey: ["plusOnes", req.eventId, req.guestId] }),
  });
}
