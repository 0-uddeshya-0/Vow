import { Section } from "../../components/ui/Section";
import { useI18n } from "../../i18n";
import type { Embed } from "../../types";

/**
 * Generic embeds — a map, a playlist, a form. Rendered in a locked-down iframe.
 * Only the admin can add these, so the URL is trusted; the sandbox and
 * referrer policy are defence in depth. Only https URLs are framed.
 */
function EmbedFrame({ embed, label }: { embed: Embed; label: string }) {
  const height = Math.min(Math.max(embed.height || 420, 120), 900);
  if (!/^https:\/\//i.test(embed.url)) return null;
  return (
    <div className="glass overflow-hidden rounded-[var(--radius-card)]">
      <iframe
        src={embed.url}
        title={label}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
        referrerPolicy="no-referrer"
        allowFullScreen
        className="block w-full"
        style={{ height, border: 0 }}
      />
    </div>
  );
}

export function EmbedsSection({ embeds }: { embeds: Embed[] | undefined }) {
  const { lt } = useI18n();
  if (!embeds?.length) return null;
  return (
    <>
      {embeds
        .filter((em) => /^https:\/\//i.test(em.url))
        .map((em) => {
          const label = lt(em.title);
          return (
            <Section key={em.id} id={`embed-${em.id}`} title={label}>
              <EmbedFrame embed={em} label={label} />
            </Section>
          );
        })}
    </>
  );
}
