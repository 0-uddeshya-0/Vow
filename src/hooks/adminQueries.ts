import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { data } from "../services/data";
import type {
  EventDoc,
  FaqItem,
  GalleryImage,
  Guest,
  Hotel,
  Message,
  PlusOneRequest,
  ScheduleItem,
  Settings,
  WeatherSettings,
} from "../types";

/** Everything the CMS touches is invalidated together — one small event's worth of data. */
function useInvalidateAll() {
  const qc = useQueryClient();
  return () => void qc.invalidateQueries();
}

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

/** Named as a hook because it is only ever called from the hooks below. */
function useAdminMutation<T>(fn: (v: T) => Promise<void>) {
  const invalidate = useInvalidateAll();
  return useMutation({ mutationFn: fn, onSuccess: invalidate });
}

export const useSaveGuest = () => useAdminMutation<Guest>((g) => data.adminSaveGuest(g));
export const useDeleteGuest = () =>
  useAdminMutation<{ eventId: string; id: string }>((v) => data.adminDeleteGuest(v.eventId, v.id));

export const useSavePlusOne = () => useAdminMutation<PlusOneRequest>((p) => data.adminSavePlusOne(p));

export const useSaveEvent = () => useAdminMutation<EventDoc>((e) => data.adminSaveEvent(e));
export const useSaveSettings = () => useAdminMutation<Settings>((s) => data.adminSaveSettings(s));
export const useSaveWeatherSettings = () =>
  useAdminMutation<WeatherSettings>((w) => data.adminSaveWeatherSettings(w));

export const useSaveScheduleItem = () => useAdminMutation<ScheduleItem>((i) => data.adminSaveScheduleItem(i));
export const useDeleteScheduleItem = () =>
  useAdminMutation<{ eventId: string; id: string }>((v) => data.adminDeleteScheduleItem(v.eventId, v.id));

export const useSaveHotel = () => useAdminMutation<Hotel>((h) => data.adminSaveHotel(h));
export const useDeleteHotel = () =>
  useAdminMutation<{ eventId: string; id: string }>((v) => data.adminDeleteHotel(v.eventId, v.id));

export const useSaveFaq = () => useAdminMutation<FaqItem>((f) => data.adminSaveFaq(f));
export const useDeleteFaq = () =>
  useAdminMutation<{ eventId: string; id: string }>((v) => data.adminDeleteFaq(v.eventId, v.id));

export const useSaveGalleryImage = () => useAdminMutation<GalleryImage>((g) => data.adminSaveGalleryImage(g));
export const useDeleteGalleryImage = () =>
  useAdminMutation<{ eventId: string; id: string }>((v) => data.adminDeleteGalleryImage(v.eventId, v.id));

export const useSaveMessage = () => useAdminMutation<Message>((m) => data.adminSaveMessage(m));
export const useDeleteMessage = () =>
  useAdminMutation<{ eventId: string; id: string }>((v) => data.adminDeleteMessage(v.eventId, v.id));
