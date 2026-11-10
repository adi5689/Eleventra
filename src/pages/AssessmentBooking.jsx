import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import FormField from "../components/FormField";
import { api } from "../lib/api";

const levels = [
  "Grade 12",
  "Undergraduate",
  "Graduate",
  "Postgraduate",
  "Professional course",
  "Looking for a job",
  "Working, considering a change",
];

export default function AssessmentBooking() {
  const [params] = useSearchParams();
  const career = (params.get("career") || "").slice(0, 120);
  const requestId = useRef(null);
  const resultRef = useRef(null);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    requestId.current ||= crypto.randomUUID();
    setPending(true);
    setError("");
    try {
      const response = await api("/api/enquiries", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          id: requestId.current,
          student: values.student.trim(),
          email: values.email.trim(),
          source: "career-assessment",
          service: "discovery",
          message: career ? `Career of interest: ${career}` : "",
        }),
      });
      if (!response?.saved)
        throw new Error(
          "Your booking could not be confirmed. Please try again.",
        );
      setSaved(true);
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch (err) {
      setError(err.message || "Unable to save your booking. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="max-w-[1100px] mx-auto px-[clamp(20px,4vw,40px)] py-[clamp(40px,7vw,88px)]">
      <Link
        to="/careers"
        className="inline-flex items-center gap-2 font-display text-sm font-semibold text-ink-soft hover:text-navy mb-9"
      >
        <ArrowLeft size={16} /> Career options
      </Link>
      <div className="grid min-[821px]:grid-cols-[1fr_1.1fr] gap-[clamp(28px,6vw,72px)] items-start">
        <div className="min-[821px]:sticky min-[821px]:top-32">
          <p className="eyebrow navy">Your next step</p>
          <h1 className="text-[clamp(2.3rem,4.5vw,3.5rem)] text-balance">
            Book a career assessment.
          </h1>
          <p className="mt-5 text-ink-soft max-w-[38ch]">
            Understand your strengths, explore what suits you, and build a
            clearer plan for your future.
          </p>
          <div className="mt-8 border-l-4 border-gold pl-5">
            <h2 className="text-lg">What happens next?</h2>
            <p className="text-sm text-ink-soft mt-2">
              Our team will contact you to discuss the assessment and arrange a
              suitable time.
            </p>
          </div>
          {career && (
            <p className="mt-6 inline-block rounded-xl border border-rule bg-paper px-4 py-3 font-display text-sm">
              Career of interest: <strong>{career}</strong>
            </p>
          )}
        </div>
        <div className="rounded-[24px] border border-rule bg-paper p-[clamp(24px,4vw,36px)] shadow-sm">
          {saved ? (
            <div
              ref={resultRef}
              tabIndex={-1}
              role="status"
              className="grid gap-5 py-5 focus:outline-none"
            >
              <CheckCircle2 size={36} className="text-gold-text" />
              <h2 className="text-2xl">Your request is saved.</h2>
              <p className="text-ink-soft">
                Our team will contact you to arrange your career assessment.
                Your appointment time will be confirmed with you.
              </p>
              <Link
                to="/careers"
                className="btn btn-primary justify-self-start"
              >
                Explore careers <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl">Let’s get to know you</h2>
              <p className="font-display text-sm text-ink-soft mt-2 mb-6">
                All fields are required unless marked optional.
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
                  className="grid gap-4 m-0 p-0 border-0"
                >
                  <FormField
                    id="assessment-name"
                    label="Full name"
                    name="student"
                    placeholder="Your full name"
                    autoComplete="name"
                    minLength={2}
                    maxLength={120}
                    required
                  />
                  <FormField
                    id="assessment-email"
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                  <FormField
                    id="assessment-phone"
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    autoComplete="tel"
                    pattern="[+]?[0-9 ]{10,18}"
                    maxLength={25}
                    required
                  />
                  <FormField
                    id="assessment-level"
                    label="Current level"
                    name="stage"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select your current level
                    </option>
                    {levels.map((level) => (
                      <option key={level}>{level}</option>
                    ))}
                  </FormField>
                  <FormField
                    id="assessment-city"
                    label="City (optional)"
                    name="city"
                    placeholder="Your city"
                    autoComplete="address-level2"
                    maxLength={120}
                  />
                  <div hidden aria-hidden="true">
                    <label htmlFor="assessment-website">Leave empty</label>
                    <input
                      id="assessment-website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <p className="font-display text-xs text-ink-soft">
                    By submitting, you agree to be contacted about your
                    assessment request.
                  </p>
                  {error && (
                    <p role="alert" className="text-error font-display text-sm">
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
                        Saving…
                      </>
                    ) : (
                      <>
                        Request an assessment <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </fieldset>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
