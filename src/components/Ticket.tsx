import type { Title } from "../data/titles";

export default function Ticket({ item }: { item: Title }) {
  return (
    <div className="ticket">
      <div className="ticket-top">
        <span className={`type-badge ${item.type === "series" ? "series" : ""}`}>
          {item.type === "series" ? "Series" : "Movie"}
        </span>
        {item.trending && <span className="type-badge trending">🔥 Trending</span>}
        {item.popular && <span className="type-badge trending">⭐ Popular</span>}
        <div className="ticket-title mt-2.5">{item.t}</div>
        <div className="meta-line mt-2">
          <span>{item.year}</span>
          <span className="rating">★ {item.rating}</span>
          <span>{item.country}</span>
        </div>
      </div>
      <div className="px-5 pt-4 pb-5">
        <div className="desc mb-3.5">{item.desc}</div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.genres.map((g) => (
            <span className="tag" key={g}>
              {g}
            </span>
          ))}
        </div>
        <div className="info-block">
          <div className="info-line">
            <span className="label">Dubbed In</span>
            <span className="value">{item.dubbed.join(", ")}</span>
          </div>
          <div className="info-line">
            <span className="label">Watch On</span>
            <span className="value">{item.platform}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
