import type { Title } from "../data/titles";
import Ticket from "./Ticket";

export default function Row({
  emoji,
  title,
  subtitle,
  items,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  items: Title[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="max-w-[1100px] mx-auto px-5 mt-10">
      <div className="flex items-baseline gap-3 mb-4 flex-wrap">
        <h2 className="section-heading">
          {emoji} {title}
        </h2>
        <span className="font-mono-brand text-[11px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          {subtitle}
        </span>
      </div>
      <div className="scroll-row">
        {items.map((item) => (
          <Ticket item={item} key={item.t} />
        ))}
      </div>
    </section>
  );
}
