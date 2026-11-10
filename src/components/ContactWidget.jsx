import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, CheckCircle2, LoaderCircle } from "lucide-react";
import WidgetField from "./FormField";
import { api } from "../lib/api";

const interests = [
  ["discovery", "Career Discovery & Assessment"],
  ["planning", "Career & Education Planning"],
  ["employability", "Employability & Job Readiness"],
  ["overseas", "Overseas Education"],
  ["workshops", "Career Workshops"],
];

export default function ContactWidget() {
  const widget = useRef(null);
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const requestId = useRef(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() =>
      widget.current?.querySelector("input")?.focus({ preventScroll: true }),
    );
    function dismiss(event) {
      if (event.type === "keydown" && event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      } else if (
        event.type === "pointerdown" &&
        !widget.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, [open]);
  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    requestId.current ||= crypto.randomUUID();
    setPending(true);
    setError("");
    try {
      await api("/api/enquiries", {
        method: "POST",
        body: JSON.stringify({
          ...fields,
          source: "home-widget",
          student: fields.student.trim(),
          email: fields.email.trim(),
          id: requestId.current,
        }),
      });
      form.reset();
      requestId.current = null;
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Unable to save your enquiry. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <div
      ref={widget}
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 w-[min(360px,calc(100vw-60px))] transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      <button
        ref={trigger}
        type="button"
        onClick={() => {
          if (open) close();
          else setOpen(true);
        }}
        aria-expanded={open}
        aria-controls="quick-contact-panel"
        aria-haspopup="dialog"
        className="absolute right-full top-1/2 -translate-y-1/2 bg-navy text-paper rounded-l-2xl border border-r-0 border-rule shadow-lg w-12 py-5 flex flex-col items-center gap-3 hover:bg-night transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        <MessageCircle size={20} aria-hidden="true" />
        <span className="font-display font-bold [writing-mode:vertical-rl]">
          Contact
        </span>
      </button>
      <section
        id="quick-contact-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="quick-contact-title"
        aria-hidden={!open}
        inert={!open}
        className="max-h-[calc(100dvh-112px)] overflow-y-auto rounded-l-[22px] border border-r-0 border-rule bg-paper text-ink shadow-2xl"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="font-display text-xs font-semibold text-gold-text mb-1">
                Let's talk
              </p>
              <h2
                id="quick-contact-title"
                className="text-[1.5rem] leading-tight"
              >
                Contact us
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close contact form"
              className="flex size-10 shrink-0 items-center justify-center -mr-2 -mt-1 rounded-full text-ink-soft hover:bg-mist focus-visible:outline-2 focus-visible:outline-gold"
            >
              <X size={20} />
            </button>
          </div>
          {success ? (
            <div role="status" className="grid gap-4 py-4">
              <CheckCircle2 className="text-gold-text" size={36} />
              <h3>Thank you for reaching out.</h3>
              <p className="text-ink-soft">
                Your enquiry is saved. Our team will contact you about your next
                step.
              </p>
              <button
                type="button"
                className="btn btn-primary mt-2"
                onClick={close}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="font-display text-sm leading-relaxed text-ink-soft mb-4">
                Leave your details. We’ll be in touch.
              </p>
              <form
                onSubmit={submit}
                onChange={() => {
                  requestId.current = null;
                  setError("");
                }}
                aria-busy={pending}
              >
                <fieldset
                  disabled={pending}
                  className="grid gap-3 border-0 p-0 m-0"
                >
                  <WidgetField
                    id="quick-name"
                    label="Name"
                    name="student"
                    autoComplete="name"
                    placeholder="Your full name"
                    minLength={2}
                    maxLength={120}
                    required
                  />
                  <WidgetField
                    id="quick-email"
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    maxLength={254}
                    required
                  />
                  <WidgetField
                    id="quick-phone"
                    label="Phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Your phone number"
                    minLength={10}
                    maxLength={25}
                    pattern="[+]?[0-9 ]{10,18}"
                    title="Enter a phone number with 10 to 15 digits, optionally including a country code."
                    required
                  />
                  <WidgetField
                    id="quick-interest"
                    label="Interest area"
                    name="service"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select an interest
                    </option>
                    {interests.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </WidgetField>
                  <div hidden aria-hidden="true">
                    <label htmlFor="quick-website">Leave this empty</label>
                    <input
                      id="quick-website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <p className="font-display text-[11px] leading-relaxed text-ink-soft">
                    By submitting, you agree to be contacted about your enquiry.
                  </p>
                  {error && (
                    <p role="alert" className="text-ink font-medium">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 font-display text-sm font-bold text-paper transition-colors hover:bg-night focus-visible:outline-gold disabled:opacity-60"
                  >
                    {pending ? (
                      <>
                        <LoaderCircle size={18} className="animate-spin" />{" "}
                        Sending…
                      </>
                    ) : (
                      "Submit enquiry"
                    )}
                  </button>
                </fieldset>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
