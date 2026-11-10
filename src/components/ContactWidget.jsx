import { useRef, useState } from "react";
import { MessageCircle, X, CheckCircle2, LoaderCircle } from "lucide-react";
import { api } from "../lib/api";

const interests = [
  ["discovery", "Career Discovery & Assessment"],
  ["planning", "Career & Education Planning"],
  ["employability", "Employability & Job Readiness"],
  ["overseas", "Overseas Education"],
  ["workshops", "Career Workshops"],
];

export default function ContactWidget() {
  const dialog = useRef(null);
  const trigger = useRef(null);
  const requestId = useRef(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  function close() {
    dialog.current?.close();
    trigger.current?.focus();
  }
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
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-navy text-paper rounded-l-2xl border border-rule shadow-lg px-3 py-5 flex flex-col items-center gap-3 hover:bg-night transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        <MessageCircle size={20} aria-hidden="true" />
        <span className="font-display font-bold [writing-mode:vertical-rl]">
          Contact
        </span>
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="quick-contact-title"
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
        className="m-auto w-[calc(100%-32px)] max-w-[440px] max-h-[90dvh] overflow-y-auto rounded-[24px] border border-rule bg-paper text-ink p-0 shadow-2xl backdrop:bg-night/60 backdrop:backdrop-blur-sm"
      >
        <div className="p-[clamp(24px,5vw,36px)]">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="eyebrow navy">Let's talk</p>
              <h2 id="quick-contact-title" className="text-[1.8rem]">
                Contact us
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close contact form"
              className="rounded-full p-2 hover:bg-mist focus-visible:outline-2 focus-visible:outline-gold"
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
              <p className="text-ink-soft mb-6">
                Share your details and our team will get in touch.
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
                  className="grid gap-4 border-0 p-0 m-0"
                >
                  <div className="grid gap-1.5">
                    <label htmlFor="quick-name">Name</label>
                    <input
                      autoFocus
                      id="quick-name"
                      name="student"
                      autoComplete="name"
                      minLength={2}
                      maxLength={120}
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor="quick-email">Email</label>
                    <input
                      id="quick-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor="quick-phone">Phone</label>
                    <input
                      id="quick-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      minLength={10}
                      maxLength={25}
                      pattern="[+]?[0-9 ]{10,18}"
                      title="Enter a phone number with 10 to 15 digits, optionally including a country code."
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor="quick-interest">Interest area</label>
                    <select
                      id="quick-interest"
                      name="service"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose your interest area
                      </option>
                      {interests.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div hidden aria-hidden="true">
                    <label htmlFor="quick-website">Leave this empty</label>
                    <input
                      id="quick-website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <p className="text-xs text-ink-soft">
                    By submitting, you agree to be contacted about your enquiry.
                  </p>
                  {error && (
                    <p role="alert" className="text-ink font-medium">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary justify-center w-full disabled:opacity-60"
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
      </dialog>
    </>
  );
}
