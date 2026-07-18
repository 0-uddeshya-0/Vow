import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ACTIVE_EVENT_SLUG, data } from "../services/data";
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

export function useCreatePlusOne() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: PlusOneRequest) => data.createPlusOneRequest(req),
    onSuccess: (_r, req) =>
      void qc.invalidateQueries({ queryKey: ["plusOnes", req.eventId, req.guestId] }),
  });
}
