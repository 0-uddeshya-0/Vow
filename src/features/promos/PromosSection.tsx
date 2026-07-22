import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "../../i18n";
import { fadeUp, reveal } from "../../animations/variants";
import { CardSkeleton } from "../../components/ui/Skeleton";
import type { Promo } from "../../types";

const linkCls =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full border border-hairline-soft px-4 " +
  "text-sm text-ink-soft transition-colors hover:border-hairline hover:text-gold-ink";

function PromoCard({ promo }: { promo: Promo }) {
  const { t, lt } = useI18n();
  return (
    <motion.li variants={fadeUp} className="glass overflow-hidden rounded-[var(--radius-card)]">
      {promo.imageUrl ? (
        <img src={promo.imageUrl} alt="" loading="lazy" className="h-40 w-full object-cover" />
      ) : null}
      <div className="p-6">
        {promo.label ? (
          <span className="inline-flex items-center rounded-full border border-hairline bg-surface/60 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.12em] text-gold-ink">
            {lt(promo.label)}
          </span>
        ) : null}
        <h3 className="mt-2 font-display text-2xl text-ink">{lt(promo.title)}</h3>
        {promo.body ? <p className="mt-1.5 max-w-[52ch] text-ink-soft">{lt(promo.body)}</p> : null}
        {promo.url ? (
          <div className="mt-4">
            <a className={linkCls} href={promo.url} target="_blank" rel="noreferrer noopener">
              {t.recommendations.visit} <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        ) : null}
      </div>
    </motion.li>
  );
}

export function PromosSection({ promos, loading }: { promos: Promo[] | undefined; loading: boolean }) {
  if (loading || !promos) return <CardSkeleton />;
  if (promos.length === 0) return null;
  return (
    <motion.ul {...reveal(0.15)} className="flex list-none flex-col gap-4 p-0">
      {promos.map((p) => (
        <PromoCard key={p.id} promo={p} />
      ))}
    </motion.ul>
  );
}
