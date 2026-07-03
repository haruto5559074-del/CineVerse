import { useMemo, useState } from "react";
import { DATA, GENRES, MOODS, COUNTRIES, type Title } from "./data/titles";
import { HERO_VIDEO_URL, GALLERY_IMAGES } from "./data/media";
import Ticket from "./components/Ticket";
import Row from "./components/Row";

type TypeFilter = "both" | "movie" | "series";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Chip({
  label,
  active,
  onClick,
  mood,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  mood?: boolean;
}) {
  return (
    <div
      className={`chip ${mood ? "mood" : ""} ${active ? "active" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      {label}
    </div>
  );
}

export default function App() {
  const [type, setType] = useState<TypeFilter>("both");
  const [genres, setGenres] = useState<Set<string>>(new Set());
  const [mood, setMood] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [results, setResults] = useState<Title[]>(() => shuffle(DATA).slice(0, 3));
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return DATA.filter(
      (d) =>
        d.t.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.platform.toLowerCase().includes(q) ||
        d.genres.some((g) => g.toLowerCase().includes(q)) ||
        d.moods.some((m) => m.toLowerCase().includes(q)) ||
        d.dubbed.some((l) => l.toLowerCase().includes(q))
    ).slice(0, 12);
  }, [query]);

  const trendingMovies = useMemo(
    () => DATA.filter((d) => d.trending && d.type === "movie"),
    []
  );
  const trendingSeries = useMemo(
    () => DATA.filter((d) => d.trending && d.type === "series"),
    []
  );
  const mostPopular = useMemo(() => DATA.filter((d) => d.popular), []);
  const koreanDramas = useMemo(() => DATA.filter((d) => d.country === "South Korea"), []);
  const turkishDramas = useMemo(() => DATA.filter((d) => d.country === "Turkey"), []);
  const chineseThaiDramas = useMemo(
    () => DATA.filter((d) => d.country === "China" || d.country === "Thailand"),
    []
  );
  const pakistaniAll = useMemo(() => DATA.filter((d) => d.country === "Pakistan"), []);
  const awardWinners = useMemo(() => DATA.filter((d) => d.award), []);
  const classics = useMemo(() => DATA.filter((d) => d.classic), []);
  const animePicks = useMemo(() => DATA.filter((d) => d.country === "Japan" && d.genres.includes("Animation")), []);
  const desiPicks = useMemo(
    () => DATA.filter((d) => d.country === "India" && d.type === "series"),
    []
  );
  const bollywoodHits = useMemo(
    () => DATA.filter((d) => (d.country === "India" || d.country === "Pakistan") && d.type === "movie" && d.rating >= 8),
    []
  );
  const worldPicks = useMemo(
    () => DATA.filter((d) => ["France", "Italy", "Mexico", "Spain", "Germany", "Egypt", "Nigeria", "Ireland"].includes(d.country)),
    []
  );
  const galleryShuffled = useMemo(() => shuffle(GALLERY_IMAGES), []);
  const posterCaptions = useMemo(() => shuffle(DATA).slice(0, GALLERY_IMAGES.length), []);

  function toggleGenre(g: string) {
    setGenres((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  }

  function matchPool(): Title[] {
    return DATA.filter((d) => {
      const typeOk = type === "both" || d.type === type;
      const genreOk = genres.size === 0 || d.genres.some((g) => genres.has(g));
      const moodOk = !mood || d.moods.includes(mood);
      const countryOk = !country || d.country === country;
      return typeOk && genreOk && moodOk && countryOk;
    });
  }

  function handleSuggest() {
    setHasSearched(true);
    setResults(shuffle(matchPool()).slice(0, 3));
  }

  const pool = hasSearched ? matchPool() : DATA;
  const statusText = !hasSearched
    ? ""
    : pool.length === 0
    ? ""
    : `${pool.length} matches found — showing ${Math.min(3, pool.length)} at random.`;

  return (
    <div className="pb-16">
      <div className="filmstrip" />

      {/* Hero video */}
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(220px, 42vw, 420px)" }}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={HERO_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,11,13,0.35) 0%, rgba(15,11,13,0.75) 70%, var(--bg) 100%)",
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5">
          <div className="kicker">What should we watch tonight?</div>
          <h1 className="brand-title mt-1.5">CINEVERSE</h1>
          <p className="text-[15px] mt-2.5 max-w-[560px] mx-auto" style={{ color: "var(--cream)" }}>
            Your desi-to-global guide for movies, series, K-dramas, Turkish dramas, anime &amp;
            award-winning cinema — pick a mood, we'll find the watch.
          </p>
        </div>
      </div>

      {/* Search */}
      <section className="max-w-[760px] mx-auto px-5 mt-8">
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg" aria-hidden>
            🔍
          </span>
          <input
            type="search"
            className="search-input"
            placeholder="Search title, genre, country, platform or language…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search movies and series"
          />
        </div>
        {query.trim().length >= 2 && (
          <div className="mt-3 font-mono-brand text-[11px] uppercase tracking-wider text-center" style={{ color: "var(--muted)" }}>
            {searchResults.length === 0
              ? `No results for "${query}" — try another spelling`
              : `${searchResults.length} result${searchResults.length > 1 ? "s" : ""} for "${query}"`}
          </div>
        )}
      </section>
      {query.trim().length >= 2 && searchResults.length > 0 && (
        <div className="max-w-[1050px] mx-auto mt-6 px-5 grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))" }}>
          {searchResults.map((item) => (
            <Ticket item={item} key={`search-${item.t}`} />
          ))}
        </div>
      )}

      <Row emoji="⭐" title="Most Popular" subtitle="The all-time favorites" items={mostPopular} />
      <Row emoji="🔥" title="Trending Movies" subtitle="Hot right now" items={trendingMovies} />
      <Row emoji="📺" title="Trending Series" subtitle="Binge-worthy picks" items={trendingSeries} />
      <Row emoji="🇰🇷" title="Korean Dramas" subtitle="K-drama feels, straight from Seoul" items={koreanDramas} />
      <Row emoji="🇹🇷" title="Turkish Dramas" subtitle="Epic romance & drama from Turkey" items={turkishDramas} />
      <Row emoji="🐉" title="Chinese & Thai Dramas" subtitle="Palace intrigue & campus drama" items={chineseThaiDramas} />
      <Row emoji="🇵🇰" title="Pakistan Zone" subtitle="Everything Pakistani — films & dramas" items={pakistaniAll} />
      <Row emoji="🎭" title="Desi Binge" subtitle="Indian series worth every episode" items={desiPicks} />
      <Row emoji="🎥" title="Bollywood & Lollywood Gems" subtitle="Top-rated desi films" items={bollywoodHits} />
      <Row emoji="🏆" title="Award Winners" subtitle="Critically acclaimed masterpieces" items={awardWinners} />
      <Row emoji="🎞️" title="Timeless Classics" subtitle="The ones everyone should watch once" items={classics} />
      <Row emoji="🍥" title="Anime Corner" subtitle="For the anime lovers" items={animePicks} />
      <Row emoji="🌍" title="World Cinema" subtitle="Stories from every corner of the globe" items={worldPicks} />

      {/* Random poster gallery */}
      <section className="max-w-[1100px] mx-auto px-5 mt-10">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="section-heading">🎬 On Everyone's Screen</h2>
          <span className="font-mono-brand text-[11px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            A little movie night mood board
          </span>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
          {galleryShuffled.map((src, i) => (
            <div
              key={src}
              className="relative rounded-xl overflow-hidden border"
              style={{ borderColor: "rgba(232,184,74,0.18)", aspectRatio: "2 / 3" }}
            >
              <img src={src} alt="Movie night" className="w-full h-full object-cover" loading="lazy" />
              <div
                className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-[11px] font-semibold truncate"
                style={{
                  background: "linear-gradient(180deg, transparent, rgba(15,11,13,0.9))",
                  color: "var(--cream)",
                }}
              >
                {posterCaptions[i]?.t}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Panel */}
      <div className="panel max-w-[900px] mx-auto mt-12 px-6 py-7">
        <div className="mb-5">
          <span className="row-label block mb-3">What are you in the mood for</span>
          <div className="flex flex-wrap gap-2.5">
            {(["both", "movie", "series"] as TypeFilter[]).map((v) => (
              <Chip key={v} label={v === "both" ? "Both" : v === "movie" ? "Movie" : "Series"} active={type === v} onClick={() => setType(v)} />
            ))}
          </div>
        </div>

        <div className="mb-5">
          <span className="row-label block mb-3">Genre (pick as many as you like)</span>
          <div className="flex flex-wrap gap-2.5">
            {GENRES.map((g) => (
              <Chip key={g} label={g} active={genres.has(g)} onClick={() => toggleGenre(g)} />
            ))}
          </div>
        </div>

        <div className="mb-5">
          <span className="row-label block mb-3">Mood</span>
          <div className="flex flex-wrap gap-2.5">
            {MOODS.map((m) => (
              <Chip key={m} label={m} mood active={mood === m} onClick={() => setMood(mood === m ? null : m)} />
            ))}
          </div>
        </div>

        <div>
          <span className="row-label block mb-3">Country</span>
          <div className="flex flex-wrap gap-2.5">
            {COUNTRIES.map((c) => (
              <Chip key={c} label={c} active={country === c} onClick={() => setCountry(country === c ? null : c)} />
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3.5 mt-8 flex-wrap">
          <button className="primary" onClick={handleSuggest}>
            Suggest
          </button>
          <button className="secondary" onClick={handleSuggest}>
            Show More
          </button>
        </div>
        <div className="text-center text-[13px] mt-4 min-h-[16px]" style={{ color: "var(--muted)" }}>
          {statusText}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1050px] mx-auto mt-11 px-5 grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))" }}>
        {results.length === 0 ? (
          <div className="empty-state max-w-[500px] mx-auto text-center px-5 mt-4 col-span-full">
            <span className="big block mb-2.5">Nothing matched</span>
            Try loosening a filter — maybe drop the genre or country pick.
          </div>
        ) : (
          results.map((item) => <Ticket item={item} key={item.t} />)
        )}
      </div>

      <footer className="text-center mt-14 font-mono-brand text-[11px] tracking-wider uppercase" style={{ color: "var(--muted)" }}>
        CineVerse &middot; Curated picks, no login, no ads
      </footer>
    </div>
  );
}
