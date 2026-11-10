import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  ExternalLink,
  Inbox,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { api } from "../lib/api";
const serviceNames = {
  discovery: "Career discovery",
  planning: "Education planning",
  employability: "Job readiness",
  "profile-evaluation": "Profile evaluation",
  "online-tests": "Online tests",
  psychometric: "Psychometric assessment",
  counselling: "Career architecting",
  university: "University admission",
  workshops: "Workshop",
  overseas: "Overseas education",
};
const button =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rule bg-paper px-4 text-sm font-bold text-navy transition hover:border-navy disabled:cursor-not-allowed disabled:opacity-50";
const field =
  "min-h-12 w-full rounded-xl border border-input-border bg-paper px-4 text-base focus:border-navy focus:outline-none focus:ring-3 focus:ring-gold/30";
const date = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
function StatusBadge({ status }) {
  const classes = {
    new: "bg-success text-gold-text",
    contacted: "bg-pay-bg text-pay-text",
    closed: "bg-mist text-ink-soft",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${classes[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
function Login({ onLogin }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    const values = new FormData(event.currentTarget);
    try {
      onLogin(
        await api("/api/admin/login", {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(values)),
        }),
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="grid min-h-screen bg-mist font-display min-[1000px]:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-night p-[clamp(40px,6vw,88px)] text-paper min-[1000px]:flex">
        <Link to="/" aria-label="Eleventra home">
          <img
            src="/assets/logo-white.png"
            alt="Eleventra"
            className="w-[170px]"
          />
        </Link>
        <div className="relative z-1 py-20">
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-paper/20 px-3 py-1.5 text-xs tracking-wide text-on-night">
            <ShieldCheck size={14} /> Your team's workspace
          </span>
          <h2 className="max-w-[480px] text-[clamp(2.5rem,4vw,4rem)] leading-[1.08] text-paper">
            Every enquiry.
            <br />
            <span className="text-gold">A new beginning.</span>
          </h2>
          <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-on-night-soft">
            A clear view of the students and families taking their next step
            with Eleventra.
          </p>
        </div>
        <p className="text-xs text-on-night-soft">
          Eleventra Career Architects · Staff access only
        </p>
        <div
          aria-hidden="true"
          className="absolute -right-32 bottom-28 size-[360px] rounded-full border-[28px] border-paper/5"
        />
      </aside>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          <Link
            to="/"
            className="mb-12 inline-flex items-center gap-2 text-sm text-ink-soft no-underline hover:text-navy"
          >
            <ArrowLeft size={16} />
            Back to website
          </Link>
          <div className="mb-6 grid size-12 place-items-center rounded-2xl border border-rule bg-paper text-navy">
            <LockKeyhole size={22} />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-gold-text">
            Eleventra admin
          </p>
          <h1 className="text-4xl">Welcome back.</h1>
          <p className="mt-3 text-base text-ink-soft">
            Sign in to manage your enquiries.
          </p>
          <form
            onSubmit={submit}
            className="mt-8 grid gap-5"
            aria-busy={pending}
          >
            <div className="grid gap-2">
              <label htmlFor="admin-username" className="text-sm font-bold">
                Email
              </label>
              <input
                className={field}
                id="admin-username"
                name="username"
                type="email"
                autoComplete="username"
                required
                maxLength={254}
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="admin-password" className="text-sm font-bold">
                Password
              </label>
              <input
                className={field}
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                maxLength={256}
              />
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-placeholder-border bg-placeholder-bg p-3 text-sm text-error"
              >
                {error}
              </p>
            )}
            <button
              disabled={pending}
              className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy px-5 font-bold text-paper transition hover:bg-night disabled:opacity-60"
            >
              {pending ? (
                <>
                  <LoaderCircle className="animate-spin" size={18} />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
          <p className="mt-6 flex items-center gap-2 text-xs text-ink-soft">
            <ShieldCheck size={14} />
            Private access for authorised staff.
          </p>
        </div>
      </div>
    </div>
  );
}
function EnquiryDetail({ item, onClose, onUpdated, onExpired }) {
  const [pending, setPending] = useState(false);
  const heading = useRef(null);
  useEffect(() => {
    heading.current?.focus();
  }, [item.id]);
  const [error, setError] = useState("");
  async function change(status) {
    setPending(true);
    setError("");
    try {
      await api("/api/admin/enquiries/" + item.id, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      onUpdated({ ...item, status });
    } catch (error) {
      if (error.status === 401) onExpired();
      else setError(error.message);
    } finally {
      setPending(false);
    }
  }
  return (
    <section
      className="rounded-2xl border border-rule bg-paper p-5 sm:p-8"
      aria-labelledby="enquiry-name"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-navy"
            onClick={onClose}
          >
            <ArrowLeft size={16} />
            Contact enquiries
          </button>
          <h2
            ref={heading}
            tabIndex={-1}
            id="enquiry-name"
            className="text-3xl scroll-mt-28 focus:outline-none"
          >
            {item.student}
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Submitted {date(item.createdAt)} IST
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <a className={button} href={"tel:" + item.phone.replace(/[^+\d]/g, "")}>
          <Phone size={15} />
          Call student
        </a>
        <a className={button} href={"mailto:" + item.email}>
          <Mail size={15} />
          Email student
        </a>
      </div>
      <dl className="mt-8 grid gap-x-8 gap-y-6 border-t border-rule pt-7 sm:grid-cols-2">
        {[
          ["Email", item.email],
          ["Phone / WhatsApp", item.phone],
          ["Parent", item.parent],
          ["City", item.city],
          ["Current level", item.stage || "Not provided"],
          ["Interest area", serviceNames[item.service] || "Not sure yet"],
          [
            "Submitted from",
            item.source === "career-assessment"
              ? "Career assessment"
              : item.source === "home-widget"
                ? "Quick enquiries"
                : "Contact form",
          ],
          ["Help needed", item.help.join(", ")],
          [
            "Google Sheets",
            item.sheetSyncedAt
              ? "Synced " + date(item.sheetSyncedAt) + " IST"
              : "Waiting to sync",
          ],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              {label}
            </dt>
            <dd className="mt-2 wrap-anywhere text-base text-ink">
              {value || "Not provided"}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-7 border-t border-rule pt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
          Message
        </h3>
        <p className="mt-3 whitespace-pre-wrap wrap-anywhere text-base leading-relaxed">
          {item.message || "No additional message."}
        </p>
      </div>
      <div className="mt-7 border-t border-rule pt-6">
        <label
          htmlFor="enquiry-status"
          className="mb-2 block text-sm font-bold"
        >
          Follow-up status
        </label>
        <select
          id="enquiry-status"
          disabled={pending}
          className={`${field} max-w-[240px]`}
          value={item.status}
          onChange={(event) => change(event.target.value)}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
        <p className="mt-2 text-xs text-ink-soft">
          Follow-up status is managed in this dashboard.
        </p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-error">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
const enquirySections = [
  ["contact-form", "Contact enquiries"],
  ["home-widget", "Quick enquiries"],
  ["career-assessment", "Career assessments"],
];

function Dashboard({ session, onLogout }) {
  const [data, setData] = useState(null);
  const [source, setSource] = useState("contact-form");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [notice, setNotice] = useState("");
  const load = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");
      try {
        const result = await api(
          "/api/admin/enquiries?" +
            new URLSearchParams({ search, status, page, source }),
          { signal },
        );
        setData(result);
      } catch (error) {
        if (error.name === "AbortError") return;
        if (error.status === 401) onLogout();
        else setError(error.message);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [search, status, page, source, onLogout],
  );
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => void load(controller.signal), 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [load]);
  async function logout() {
    try {
      await api("/api/admin/logout", {
        method: "POST",
      });
      onLogout();
    } catch (error) {
      if (error.status === 401) onLogout();
      else setError(error.message);
    }
  }
  async function retry() {
    setSyncing(true);
    setNotice("");
    try {
      const result = await api("/api/admin/sync", {
        method: "POST",
      });
      setNotice(
        result.lastError ||
          "Sync complete. Pending enquiries have been checked.",
      );
      await load();
    } catch (error) {
      if (error.status === 401) onLogout();
      else setNotice(error.message);
    } finally {
      setSyncing(false);
    }
  }
  const stats = data?.summary;
  return (
    <div className="min-h-screen bg-mist font-display text-ink">
      <header className="sticky top-0 z-20 border-b border-rule bg-paper/95 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-4 no-underline">
            <img
              src="/assets/logo-navy.png"
              alt="Eleventra"
              className="h-14 w-auto"
            />
            <span className="hidden border-l border-rule pl-4 text-sm font-bold text-ink-soft sm:block">
              Team workspace
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden items-center gap-2 text-sm font-bold text-ink-soft no-underline hover:text-navy sm:inline-flex"
            >
              View website <ExternalLink size={14} />
            </Link>
            <button className={button} onClick={logout} aria-label="Sign out">
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1440px] min-[1100px]:grid-cols-[220px_1fr]">
        <aside className="hidden min-h-[calc(100vh-80px)] border-r border-rule bg-paper px-5 py-9 min-[1100px]:flex min-[1100px]:flex-col">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[.16em] text-ink-soft">
            Workspace
          </p>
          <nav aria-label="Enquiry categories" className="mt-4 grid gap-2">
            {enquirySections.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setSource(value);
                  setSelected(null);
                  setSearch("");
                  setStatus("");
                  setPage(1);
                }}
                aria-pressed={source === value}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-left text-sm font-bold transition-colors ${source === value ? "bg-navy text-paper" : "text-ink-soft hover:bg-mist"}`}
              >
                <Inbox size={18} className="shrink-0" />
                {label}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-xl border border-rule p-4">
            <ShieldCheck size={18} className="text-gold-text" />
            <p className="mt-3 text-xs font-bold">Signed in as</p>
            <p className="mt-1 break-all text-xs text-ink-soft">
              {session.username}
            </p>
          </div>
        </aside>
        <div className="min-w-0 px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[.16em] text-gold-text">
                Your career conversations
              </p>
              <h1 className="text-[clamp(2rem,3.5vw,2.75rem)] tracking-tight">
                {enquirySections.find(([value]) => value === source)?.[1]}
              </h1>
              <p className="mt-3 text-sm text-ink-soft">
                Keep every conversation moving towards a clear next step.
              </p>
            </div>
            <button
              className={button}
              disabled={loading}
              onClick={() => void load()}
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
          <div
            role="group"
            aria-label="Enquiry source"
            className="mt-7 inline-flex flex-wrap gap-1 rounded-2xl border border-rule bg-paper p-1.5 min-[1100px]:hidden"
          >
            {enquirySections.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={source === value}
                onClick={() => {
                  setSource(value);
                  setSearch("");
                  setStatus("");
                  setPage(1);
                  setSelected(null);
                }}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-colors ${source === value ? "bg-navy text-paper" : "text-ink-soft hover:bg-mist"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 min-[800px]:grid-cols-4">
            {[
              ["Total enquiries", stats?.total, Users],
              ["New enquiries", stats?.new, Inbox],
              ["Contacted", stats?.contacted, CheckCircle2],
              ["Awaiting Sheets sync", stats?.pending, ClipboardList],
            ].map(([label, value, Icon]) => (
              <div
                key={label}
                className="rounded-2xl border border-rule bg-paper p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-ink-soft">{label}</p>
                  <Icon size={17} className="shrink-0 text-ink-soft" />
                </div>
                <p className="mt-4 text-3xl font-extrabold tracking-tight">
                  {value ?? (loading ? "—" : 0)}
                </p>
              </div>
            ))}
          </div>
          {data && (
            <div
              className={`mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 text-sm ${data.sheets.configured && !data.sheets.lastError ? "border-rule bg-paper" : "border-gold/35 bg-success"}`}
            >
              <div className="flex min-w-0 items-start gap-3">
                {data.sheets.configured && !data.sheets.lastError ? (
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-pay-text"
                  />
                ) : (
                  <CircleAlert
                    size={19}
                    className="mt-0.5 shrink-0 text-gold-text"
                  />
                )}
                <div>
                  <p className="font-bold">
                    {!data.sheets.configured
                      ? "Google Sheets setup needed"
                      : data.sheets.lastError
                        ? "Google Sheets needs attention"
                        : stats?.pending
                          ? "Google Sheets configured · sync pending"
                          : "Google Sheets configured"}
                  </p>
                  <p className="mt-1 max-w-[62ch] text-xs leading-relaxed text-ink-soft">
                    {!data.sheets.configured
                      ? "Enquiries are saved securely. Connect Google Sheets to sync them to your spreadsheet."
                      : data.sheets.lastError ||
                        `Enquiries sync automatically to “${data.sheets.tab}”.`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.sheets.url && (
                  <a
                    href={data.sheets.url}
                    target="_blank"
                    rel="noreferrer"
                    className={button}
                  >
                    Open sheet <ExternalLink size={14} />
                  </a>
                )}
                {data.sheets.configured && (
                  <button className={button} onClick={retry} disabled={syncing}>
                    {syncing ? (
                      <LoaderCircle className="animate-spin" size={14} />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    Sync now
                  </button>
                )}
              </div>
            </div>
          )}
          {notice && (
            <div
              role="status"
              className="mt-4 flex items-start justify-between gap-4 rounded-xl border border-rule bg-paper p-4 text-sm"
            >
              <p>{notice}</p>
              <button
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
              >
                <X size={18} />
              </button>
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-placeholder-bg p-4 text-sm text-error"
            >
              <p>{error}</p>
              <button className={button} onClick={() => void load()}>
                Try again
              </button>
            </div>
          )}
          <div className="mt-7">
            {selected ? (
              <EnquiryDetail
                item={selected}
                onClose={() => setSelected(null)}
                onExpired={onLogout}
                onUpdated={(item) => {
                  setSelected(item);
                  void load();
                }}
              />
            ) : (
              <section
                className="overflow-hidden rounded-2xl border border-rule bg-paper"
                aria-label="Collected enquiries"
              >
                <div className="flex flex-wrap items-center gap-3 border-b border-rule p-4 sm:p-5">
                  <div className="relative min-w-[180px] flex-1">
                    <Search
                      aria-hidden="true"
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                    />
                    <label className="sr-only" htmlFor="enquiry-search">
                      Search enquiries
                    </label>
                    <input
                      id="enquiry-search"
                      className={`${field} min-h-11 pl-10 text-sm`}
                      placeholder="Search name, email, phone or city"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                  <label className="sr-only" htmlFor="status-filter">
                    Filter by follow-up status
                  </label>
                  <select
                    id="status-filter"
                    value={status}
                    onChange={(event) => {
                      setStatus(event.target.value);
                      setPage(1);
                    }}
                    className={`${field} min-h-11 w-auto! text-sm`}
                  >
                    <option value="">All statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                {loading ? (
                  <div
                    role="status"
                    className="flex min-h-[280px] items-center justify-center gap-3 text-sm text-ink-soft"
                  >
                    <LoaderCircle size={20} className="animate-spin" />
                    Loading enquiries…
                  </div>
                ) : data?.rows.length ? (
                  <>
                    <div className="hidden grid-cols-[1.3fr_1fr_.85fr_.65fr_28px] gap-4 border-b border-rule bg-mist/50 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-soft min-[800px]:grid">
                      <span>Student / candidate</span>
                      <span>Interest area & level</span>
                      <span>Received · IST</span>
                      <span>Status</span>
                      <span />
                    </div>
                    <ul>
                      {data.rows.map((item) => (
                        <li
                          key={item.id}
                          className="border-b border-rule last:border-0"
                        >
                          <button
                            className="grid w-full items-center gap-4 px-5 py-5 text-left transition hover:bg-mist/60 min-[800px]:grid-cols-[1.3fr_1fr_.85fr_.65fr_28px]"
                            onClick={() => {
                              setSelected(item);
                            }}
                          >
                            <div className="min-w-0">
                              <span className="block truncate text-base font-bold">
                                {item.student}
                              </span>
                              <span className="mt-1 block truncate text-xs text-ink-soft">
                                {item.email}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <span className="block text-sm font-semibold">
                                {serviceNames[item.service] || "Not sure yet"}
                              </span>
                              <span className="mt-1 block text-xs text-ink-soft">
                                {item.source === "career-assessment"
                                  ? "Career assessment · "
                                  : ""}
                                {item.stage || "Not provided"}
                              </span>
                            </div>
                            <div className="text-xs leading-relaxed text-ink-soft">
                              {date(item.createdAt)}
                              <span className="mt-1 flex items-center gap-1.5">
                                {item.sheetSyncedAt ? (
                                  <>
                                    <Check size={12} />
                                    Sheet synced
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw size={12} />
                                    Sheet pending
                                  </>
                                )}
                              </span>
                            </div>
                            <div>
                              <StatusBadge status={item.status} />
                            </div>
                            <ChevronRight
                              size={17}
                              className="hidden text-ink-soft min-[800px]:block"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="grid size-14 place-items-center rounded-2xl bg-mist">
                      <Inbox size={25} className="text-ink-soft" />
                    </div>
                    <h2 className="mt-5 text-xl">
                      {search || status
                        ? "No matching enquiries"
                        : "Your next conversation starts here."}
                    </h2>
                    <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-ink-soft">
                      {search || status
                        ? "Try another search or clear the filters."
                        : "When someone submits the contact form, their details will appear here, ready for your team to follow up."}
                    </p>
                    {search || status ? (
                      <button
                        className={`${button} mt-5`}
                        onClick={() => {
                          setSearch("");
                          setStatus("");
                          setPage(1);
                        }}
                      >
                        Clear filters
                      </button>
                    ) : (
                      <Link to="/contact" className={`${button} mt-5`}>
                        View contact form <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                )}
                {data?.total > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule px-5 py-4 text-xs text-ink-soft">
                    <p>
                      {(data.page - 1) * data.pageSize + 1}–
                      {Math.min(data.page * data.pageSize, data.total)} of{" "}
                      {data.total} enquiries
                    </p>
                    <div className="flex gap-2">
                      <button
                        aria-label="Previous page"
                        className={button}
                        disabled={page <= 1 || loading}
                        onClick={() => setPage((value) => value - 1)}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        aria-label="Next page"
                        className={button}
                        disabled={page * data.pageSize >= data.total || loading}
                        onClick={() => setPage((value) => value + 1)}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
          <p className="mt-7 text-xs text-ink-soft">
            Student details are private. Access is restricted to authorised
            staff.
          </p>
        </div>
      </div>
    </div>
  );
}
export default function Admin() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const logout = useCallback(() => setSession(null), []);
  useEffect(() => {
    let active = true;
    api("/api/admin/session")
      .then((value) => {
        if (active) setSession(value);
      })
      .catch((error) => {
        if (active && error.status !== 401)
          setError("Unable to connect to your workspace. Please try again.");
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, []);
  if (checking)
    return (
      <div
        role="status"
        className="grid min-h-screen place-items-center font-display text-ink-soft"
      >
        <span className="flex items-center gap-3">
          <LoaderCircle className="animate-spin" size={20} />
          Checking your session…
        </span>
      </div>
    );
  if (error)
    return (
      <div className="grid min-h-screen place-items-center p-6 font-display">
        <div
          role="alert"
          className="max-w-md rounded-2xl border border-rule bg-paper p-8"
        >
          <CircleAlert className="text-gold-text" />
          <h1 className="mt-5 text-2xl">Unable to connect</h1>
          <p className="mt-3 text-ink-soft">{error}</p>
          <button
            className={`${button} mt-6`}
            onClick={() => location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  return session ? (
    <Dashboard session={session} onLogout={logout} />
  ) : (
    <Login onLogin={setSession} />
  );
}
