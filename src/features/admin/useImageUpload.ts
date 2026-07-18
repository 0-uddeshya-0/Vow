import { useState } from "react";
import { compressImage } from "../../lib/image";
import { data } from "../../services/data";
import type { EventDoc, Guest } from "../../types";

/**
 * Shared "pick a file from this device → hosted URL" flow for the CMS.
 * Runs through the same compress + upload pipeline as guest photos, so an
 * admin never has to find image hosting first — and, unlike pasting a
 * third-party URL, the asset ends up on the couple's own storage.
 */
export function useImageUpload(event: EventDoc, maxEdge = 1600) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const upload = async (file: File): Promise<string | null> => {
    setBusy(true);
    setError("");
    setProgress(0);
    try {
      const blob = await compressImage(file, maxEdge, 0.85);
      // Admin uploads are attributed to a synthetic guest so the photo
      // pipeline contract (guestId/guestName) stays satisfied.
      const asGuest = { id: "admin", fullName: "Admin upload" } as Guest;
      const photo = await data.uploadPhoto(event.id, asGuest, blob, setProgress);
      return photo.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "upload failed");
      return null;
    } finally {
      setBusy(false);
    }
  };

  return { upload, busy, progress, error };
}
