import { useEffect, useState, type FormEvent } from "react";
import { LogOut, ShieldCheck, TriangleAlert } from "lucide-react";
import { adminAuth, SEED_DEMO_PASSPHRASE, type AdminUser } from "../services/admin/auth";
import { useEvent } from "../hooks/queries";
import { AdminButton, Input, Labeled } from "../features/admin/kit";
import { DashboardPanel } from "../features/admin/DashboardPanel";
import { PhotosPanel } from "../features/admin/PhotosPanel";
import { GuestsPanel } from "../features/admin/GuestsPanel";
import {
  FaqPanel,
  GalleryPanel,
  GiftsPanel,
  HotelsPanel,
  MessagesPanel,
  SchedulePanel,
} from "../features/admin/ContentPanels";
import {
  ContactSettingsPanel,
  EventSettingsPanel,
  WeatherSettingsPanel,
} from "../features/admin/SettingsPanel";
import { CardSkeleton } from "../components/ui/Skeleton";

const TABS = [
  "Dashboard",
  "Guests",
  "Schedule",
  "Hotels",
  "Photos",
  "Gallery",
  "Messages",
  "FAQ",
  "Gifts",
  "Settings",
] as const;
type Tab = (typeof TABS)[number];

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(() => adminAuth.current());
  const [tab, setTab] = useState<Tab>("Dashboard");
  const { data: event, isLoading } = useEvent();

  useEffect(() => adminAuth.subscribe(setUser), []);

  if (!user) return <AdminLogin />;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-24">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Admin</h1>
          <p className="text-sm text-ink-soft">
            {user.email}
            <span className="ml-2 rounded-full border border-hairline-soft px-2 py-0.5 text-xs">
              {adminAuth.kind === "firebase" ? "Firebase" : "demo"}
            </span>
          </p>
          {adminAuth.kind === "firebase" ? (
            // Printed so it can be pasted straight into firestore.rules.
            <p className="mt-1 font-mono text-xs text-ink-soft">UID {user.uid}</p>
          ) : null}
        </div>
        <AdminButton variant="quiet" onClick={() => void adminAuth.signOut()}>
          <LogOut size={14} /> Sign out
        </AdminButton>
      </header>

      {adminAuth.kind === "seed" ? (
        <p className="mb-5 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
          <TriangleAlert size={16} className="mt-0.5 shrink-0 text-gold-ink" aria-hidden />
          <span>
            <strong>Local demo mode.</strong> There is no backend — data lives in this browser and the
            passphrase is not security. Connect Firebase (see README) for real authentication and
            storage.
          </span>
        </p>
      ) : null}

      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Admin sections">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-current={tab === t}
            className={`min-h-10 cursor-pointer rounded-full border px-4 text-sm transition-colors ${
              tab === t
                ? "border-hairline bg-surface-solid text-gold-ink"
                : "border-hairline-soft text-ink-soft hover:border-hairline hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {isLoading ? (
        <CardSkeleton />
      ) : !event ? (
        <EmptyBackend />
      ) : (
        <div className="flex flex-col gap-5">
          {tab === "Dashboard" ? <DashboardPanel event={event} /> : null}
          {tab === "Guests" ? <GuestsPanel event={event} /> : null}
          {tab === "Schedule" ? <SchedulePanel event={event} /> : null}
          {tab === "Hotels" ? <HotelsPanel event={event} /> : null}
          {tab === "Photos" ? <PhotosPanel event={event} /> : null}
          {tab === "Gallery" ? <GalleryPanel event={event} /> : null}
          {tab === "Messages" ? <MessagesPanel event={event} /> : null}
          {tab === "FAQ" ? <FaqPanel event={event} /> : null}
          {tab === "Gifts" ? <GiftsPanel event={event} /> : null}
          {tab === "Settings" ? (
            <>
              <EventSettingsPanel event={event} />
              <ContactSettingsPanel event={event} />
              <WeatherSettingsPanel event={event} />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

/**
 * A brand-new Firestore project has no documents, so the whole site would
 * render empty. This is the bootstrap — and the same button starts a new
 * event when the platform is reused.
 */
function EmptyBackend() {
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [step, setStep] = useState("");
  const [message, setMessage] = useState("");

  const run = async () => {
    setState("working");
    try {
      const { importDemoContent } = await import("../services/admin/importDemo");
      await importDemoContent(setStep);
      setState("done");
      location.reload();
    } catch (e) {
      setState("error");
      setMessage(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-hairline-soft bg-surface-solid/70 p-6">
      <h2 className="font-display text-2xl text-ink">No event found</h2>
      <p className="mt-2 max-w-[60ch] text-sm text-ink-soft">
        This backend is empty. Import the starter event to populate it — schedule, hotels, FAQ,
        messages, settings and two demo guests — then edit everything from here. All content is
        marked as placeholder until you switch that off in Settings.
      </p>
      <AdminButton className="mt-4" onClick={() => void run()} disabled={state === "working"}>
        {state === "working" ? `Importing ${step}…` : "Import starter content"}
      </AdminButton>
      {state === "error" ? (
        <p role="alert" className="mt-3 text-sm text-err">
          Import failed: {message}. If this says “permission denied”, the security rules are not
          deployed yet or ADMIN_EMAIL does not match this account.
        </p>
      ) : null}
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminAuth.signIn(email, password);
    } catch {
      setError(
        adminAuth.kind === "seed"
          ? `Wrong passphrase (demo mode uses “${SEED_DEMO_PASSPHRASE}”).`
          : "Sign-in failed. Check the email and password.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wash-garden flex min-h-svh items-center px-5 pt-20">
      <div className="glass mx-auto w-full max-w-md rounded-[var(--radius-panel)] p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-hairline bg-surface/60">
          <ShieldCheck size={20} className="text-gold-ink" aria-hidden />
        </div>
        <h1 className="mt-4 text-center font-display text-3xl text-ink">Admin</h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          {adminAuth.kind === "seed"
            ? "Local demo mode — no backend, no real authentication."
            : "Sign in with the event's administrator account."}
        </p>

        <form onSubmit={(e) => void submit(e)} className="mt-6 flex flex-col gap-4">
          <Labeled label="Email">
            <Input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Labeled>
          <Labeled
            label={adminAuth.kind === "seed" ? "Passphrase" : "Password"}
            hint={adminAuth.kind === "seed" ? `Demo passphrase: ${SEED_DEMO_PASSPHRASE}` : undefined}
          >
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Labeled>
          {error ? (
            <p role="alert" className="text-sm text-err">
              {error}
            </p>
          ) : null}
          <AdminButton type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </AdminButton>
        </form>
      </div>
    </div>
  );
}
