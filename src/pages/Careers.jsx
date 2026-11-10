import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Cpu,
  Target,
  TrendingUp,
  Zap,
  Building2,
  BriefcaseBusiness,
  Users,
  Globe2,
  Layers3,
  Play,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Flame,
  CircleDollarSign,
} from "lucide-react";
import careers from "../data/careers.json";
const icons = {
  bars: BarChart3,
  chip: Cpu,
  target: Target,
  trend: TrendingUp,
  bolt: Zap,
  building: Building2,
  briefcase: BriefcaseBusiness,
  users: Users,
  globe: Globe2,
  layers: Layers3,
  play: Play,
};
const tones = [
  "bg-[var(--tone-0-bg)] text-[var(--tone-0-fg)]",
  "bg-[var(--tone-1-bg)] text-[var(--tone-1-fg)]",
  "bg-[var(--tone-2-bg)] text-[var(--tone-2-fg)]",
  "bg-[var(--tone-3-bg)] text-[var(--tone-3-fg)]",
  "bg-[var(--tone-4-bg)] text-[var(--tone-4-fg)]",
  "bg-[var(--tone-5-bg)] text-[var(--tone-5-fg)]",
  "bg-[var(--tone-6-bg)] text-[var(--tone-6-fg)]",
  "bg-[var(--tone-7-bg)] text-[var(--tone-7-fg)]",
  "bg-[var(--tone-8-bg)] text-[var(--tone-8-fg)]",
  "bg-[var(--tone-9-bg)] text-[var(--tone-9-fg)]",
  "bg-[var(--tone-10-bg)] text-[var(--tone-10-fg)]",
  "bg-[var(--tone-11-bg)] text-[var(--tone-11-fg)]",
];
const badgeInfo = {
  D: {
    label: "IN DEMAND",
    Icon: Flame,
    style: "bg-demand-bg text-demand-text border-demand-border",
  },
  N: {
    label: "NEW AGE",
    Icon: Sparkles,
    style: "bg-new-bg text-new-text border-new-border",
  },
  H: {
    label: "HIGH PAY",
    Icon: CircleDollarSign,
    style: "bg-pay-bg text-pay-text border-pay-border",
  },
};
const wrap = "w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]";
function Badge({ value, plain = false }) {
  const badge = badgeInfo[value];
  if (!badge) return null;
  const { Icon } = badge;
  return (
    <span
      className={`inline-flex items-center gap-1 w-fit px-2.5 py-[3px] rounded-full font-display font-black text-[.64rem] tracking-[.06em] border ${badge.style}`}
    >
      {badge.label}
      {!plain && <Icon size={12} aria-hidden="true" />}
    </span>
  );
}
function CareerIcon({ career, big = false }) {
  const Icon = icons[career.icon] || BriefcaseBusiness;
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center shrink-0 ${big ? "size-[84px] rounded-3xl" : "size-14 rounded-2xl"} ${tones[Number(career.tone.slice(1))]}`}
    >
      <Icon size={big ? 38 : 26} strokeWidth={1.8} />
    </span>
  );
}
function CareerCard({ career }) {
  return (
    <Link
      to={`/careers#${career.id}`}
      className="relative flex flex-col items-center gap-3.5 min-h-[176px] min-[601px]:min-h-[190px] pt-[54px] px-2.5 min-[601px]:px-3.5 pb-5 text-center no-underline bg-paper border border-rule rounded-[14px] transition duration-200 hover:-translate-y-[3px] hover:border-navy hover:shadow-lg"
    >
      {career.badge && (
        <span className="absolute top-3 right-3">
          <Badge value={career.badge} />
        </span>
      )}
      <CareerIcon career={career} />
      <span className="font-display font-extrabold text-[.98rem] leading-[1.25] text-balance">
        {career.name}
      </span>
    </Link>
  );
}
function Detail({ career }) {
  const heading = useRef(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [career.id]);
  return (
    <article className="pt-[clamp(36px,5vw,64px)] pb-[clamp(48px,6vw,88px)]">
      <div className={wrap}>
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 font-display font-extrabold text-navy no-underline border-b-2 border-gold pb-0.5 mb-7"
        >
          <ArrowLeft size={16} />
          All careers
        </Link>
        <header className="flex flex-wrap items-center gap-x-8 gap-y-6 mb-[clamp(32px,4vw,48px)]">
          <CareerIcon career={career} big />
          <div className="grid gap-3 justify-items-start min-w-0 flex-[1_1_320px]">
            <Badge value={career.badge} />
            <h1
              ref={heading}
              tabIndex={-1}
              className="text-[clamp(2.2rem,5vw,3.8rem)] wrap-anywhere focus:outline-none"
            >
              {career.name}
            </h1>
            <p className="text-[clamp(1.08rem,1.6vw,1.25rem)] text-ink-soft max-w-[52ch]">
              {career.description}
            </p>
          </div>
        </header>
        <div className="grid min-[901px]:grid-cols-3 gap-[clamp(20px,3vw,40px)] pt-[clamp(28px,4vw,40px)] border-t-2 border-ink">
          {[
            ["What you’ll do", career.duties],
            ["Skills that help", career.skills],
            ["How to get there in India", career.education],
          ].map(([title, items], index) => (
            <section key={title}>
              <h2 className="text-[1.2rem] mb-3.5">{title}</h2>
              <ul
                className={
                  index === 1
                    ? "flex flex-wrap gap-2"
                    : `ticks ${index === 2 ? "gold" : ""}`
                }
              >
                {items.map((item) => (
                  <li
                    key={item}
                    className={
                      index === 1
                        ? "font-mono text-[.8rem] font-bold px-3 py-1.5 rounded-full bg-paper border border-rule"
                        : ""
                    }
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="mt-[clamp(32px,4vw,48px)] grid gap-3.5">
          <h2 className="text-[1.2rem]">Related careers</h2>
          <div className="flex flex-wrap gap-2.5">
            {career.related.map((id) => (
              <Link key={id} to={`/careers#${id}`} className="chip">
                {careers.find((c) => c.id === id)?.name || id}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-[18px] mt-[clamp(32px,4vw,48px)]">
          <p className="font-display font-extrabold text-[clamp(1.1rem,1.8vw,1.3rem)] text-navy">
            Wondering if {career.name} suits you?
          </p>
          <Link
            className="btn btn-primary"
            to={`/book-assessment?career=${encodeURIComponent(career.name)}`}
          >
            Book a career assessment <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-7 text-[.88rem] text-ink-soft max-w-[70ch]">
          Entrance exams, eligibility and course details change from year to
          year. Check each institution&apos;s current requirements before you
          apply.
        </p>
      </div>
    </article>
  );
}
export default function Careers() {
  const { hash } = useLocation();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const selected = careers.find((c) => c.id === hash.slice(1));
  if (selected) return <Detail career={selected} />;
  const results = careers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (filter === "all" || c.badge === filter),
  );
  return (
    <>
      <section className="pt-[clamp(48px,7vw,96px)] pb-[clamp(24px,3vw,40px)]">
        <div className={wrap}>
          <p className="eyebrow">Career options</p>
          <h1 className="text-[clamp(2.4rem,5.4vw,4.4rem)]">
            Explore 80 plus careers.
          </h1>
          <p className="mt-[22px] text-[clamp(1.08rem,1.6vw,1.25rem)] text-ink-soft max-w-[38ch]">
            See what each career involves, the skills it needs and how to get
            started in India. Select any tile to open it.
          </p>
          <div className="grid gap-4 mt-7 max-w-[760px]">
            <div>
              <label className="sr-only" htmlFor="career-search">
                Search careers
              </label>
              <input
                id="career-search"
                type="search"
                placeholder="Search careers, like design or finance"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full min-h-[52px] px-[18px] py-3 rounded-full border-[1.5px] border-input-border bg-paper font-body text-base focus:border-navy focus:ring-3 focus:ring-gold/45 focus:outline-none"
              />
            </div>
            <div
              role="group"
              aria-label="Filter careers"
              className="flex flex-wrap gap-2.5"
            >
              {[
                ["all", "All"],
                ["D", "In demand"],
                ["N", "New age"],
                ["H", "High pay"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className="chip"
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p
              role="status"
              className="min-h-[1.4em] text-ink-soft text-[.95rem]"
            >
              {query || filter !== "all"
                ? `${results.length} ${results.length === 1 ? "career matches" : "careers match"} your search.`
                : ""}
            </p>
            <ul
              aria-label="What the badges mean"
              className="grid gap-2 mt-1 text-[.9rem] text-ink-soft"
            >
              {[
                ["D", "Hired for widely, across many employers"],
                [
                  "N",
                  "A new field, or one reshaped by technology in recent years",
                ],
                [
                  "H",
                  "Commonly pays well above the graduate average at senior levels",
                ],
              ].map(([value, text]) => (
                <li
                  key={value}
                  className="flex flex-wrap items-center gap-x-2.5 gap-y-1"
                >
                  <Badge value={value} plain /> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {["Trending now", "More careers to explore"].map((group) => {
        const items = results.filter((c) => c.group === group);
        return (
          items.length > 0 && (
            <section key={group} className="py-[clamp(56px,7vw,88px)]">
              <div className={wrap}>
                <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] text-center mb-[clamp(24px,3vw,36px)]">
                  {group}
                </h2>
                <div className="grid grid-cols-2 min-[601px]:grid-cols-3 min-[861px]:grid-cols-4 min-[1101px]:grid-cols-5 gap-3 min-[601px]:gap-4">
                  {items.map((career) => (
                    <CareerCard key={career.id} career={career} />
                  ))}
                </div>
              </div>
            </section>
          )
        );
      })}
      {!results.length && (
        <div className={`${wrap} py-12 text-center`}>
          <h2 className="text-2xl">No careers found.</h2>
          <p className="mt-3 text-ink-soft">
            Try another search or change the filter.
          </p>
          <button
            className="btn btn-primary mt-6"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <section className="py-[clamp(56px,7vw,88px)]">
        <div className={wrap}>
          <div className="cta-band bg-navy text-paper rounded-[28px] p-[clamp(36px,6vw,72px)] grid min-[821px]:grid-cols-[1.3fr_auto] gap-8 items-center relative overflow-hidden">
            <div>
              <h2 className="text-paper text-[clamp(1.8rem,3.6vw,2.7rem)]">
                Not sure which career fits you?
              </h2>
              <p className="text-on-night-soft mt-3.5 max-w-[46ch]">
                A career assessment shows your strengths and interests, so you
                can shortlist careers with confidence.
              </p>
            </div>
            <Link className="btn btn-gold relative z-1" to="/book-assessment">
              Book a career assessment{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
