import { useRef, useState } from "react";
import { api } from "../lib/api";
import { useSearchParams } from "react-router-dom";
export default function Contact() {
  const [params] = useSearchParams();
  const wanted = params.get("service") || "";
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const requestId = useRef(null);
  const successRef = useRef(null);
  function clearError(event) {
    requestId.current = null;
    setSubmitError("");
    const input = event.target;
    if (input.validity?.valid) {
      input.removeAttribute("aria-invalid");
      input.closest(".field")?.classList.remove("invalid");
    }
    setSuccess(false);
  }
  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    let firstBad;
    for (const input of event.currentTarget.querySelectorAll("[required]")) {
      const valid = input.checkValidity();
      input.setAttribute("aria-invalid", String(!valid));
      input.closest(".field").classList.toggle("invalid", !valid);
      if (!valid && !firstBad) firstBad = input;
    }
    if (firstBad) {
      firstBad.focus();
      return;
    }
    const values = new FormData(form);
    requestId.current ||= crypto.randomUUID();
    const data = Object.fromEntries(values);
    data.id = requestId.current;
    data.help = values.getAll("help");
    setPending(true);
    setSubmitError("");
    setSuccess(false);
    try {
      await api("/api/enquiries", {
        method: "POST",
        body: JSON.stringify(data),
      });
      form.reset();
      requestId.current = null;
      setSuccess(true);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (error) {
      setSubmitError(
        error.message ||
          "We couldn't save your enquiry. Your details are still here; please try again.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <section
        className="pt-[clamp(48px,7vw,96px)] pb-[clamp(48px,6vw,80px)] [&_.grid]:grid-cols-1 min-[861px]:[&_.grid]:grid-cols-[1.1fr_.9fr] [&_.grid]:gap-[clamp(28px,5vw,72px)] [&_.grid]:items-center [&_h1]:text-[clamp(2.4rem,5.4vw,4.4rem)] [&_.lede]:mt-[22px] [&_img]:rounded-[14px] [&_img]:w-full [&_img]:aspect-[16/9] min-[861px]:[&_img]:aspect-[5/4] [&_img]:object-cover"
        style={{ paddingBottom: "clamp(28px,4vw,48px)" }}
      >
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <p className="eyebrow">Contact</p>
          <h1>Tell us where you are today.</h1>
          <p className="text-[clamp(1.08rem,1.6vw,1.25rem)] text-ink-soft max-w-[38ch]">
            Share a few details and a counsellor will call you to talk through
            the next step. There's no obligation to book a service.
          </p>
        </div>
      </section>

      <section
        className="py-[clamp(56px,7vw,88px)]"
        style={{ paddingTop: "0" }}
      >
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)] grid min-[961px]:grid-cols-[1.25fr_.75fr] gap-[clamp(28px,5vw,64px)] items-start">
          <div className="bg-paper rounded-[22px] p-[clamp(22px,4vw,44px)] border border-rule [&>h2]:text-[clamp(1.7rem,3vw,2.3rem)] [&>p]:text-ink-soft [&>p]:mt-3">
            <h2>Request a call back</h2>
            <p>
              Fields marked optional can be left blank. The more you share, the
              more useful our first call will be.
            </p>

            <form
              id="enquiry-form"
              noValidate
              onSubmit={submit}
              onChange={clearError}
              aria-busy={pending}
            >
              <fieldset disabled={pending}>
                <legend>Your details</legend>
                <div className="grid min-[561px]:grid-cols-2 gap-x-[18px] gap-y-4">
                  <div className="grid gap-1.5 field">
                    <label htmlFor="student">Student or candidate name</label>
                    <input
                      id="student"
                      name="student"
                      maxLength={120}
                      minLength={2}
                      autoComplete="off"
                      required
                      aria-describedby="student-error"
                    />
                    <span id="student-error" className="err" role="alert">
                      Enter the student or candidate name.
                    </span>
                  </div>
                  <div className="grid gap-1.5 field">
                    <label htmlFor="parent">
                      Parent's name{" "}
                      <span className="font-normal text-ink-soft text-[.85rem]">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="parent"
                      name="parent"
                      maxLength={120}
                      autoComplete="name"
                    />
                  </div>
                  <div className="grid gap-1.5 field">
                    <label htmlFor="phone">Phone or WhatsApp</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      pattern={String.raw`[0-9+\-\s]{10,15}`}
                      required
                      aria-describedby="phone-error"
                    />
                    <span id="phone-error" className="err" role="alert">
                      Enter a 10-digit phone number.
                    </span>
                  </div>
                  <div className="grid gap-1.5 field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      maxLength={254}
                      type="email"
                      autoComplete="email"
                      required
                      aria-describedby="email-error"
                    />
                    <span id="email-error" className="err" role="alert">
                      Enter an email address, like name@example.com.
                    </span>
                  </div>
                  <div className="grid gap-1.5 field">
                    <label htmlFor="city">
                      City{" "}
                      <span className="font-normal text-ink-soft text-[.85rem]">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="city"
                      name="city"
                      maxLength={120}
                      autoComplete="address-level2"
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset disabled={pending}>
                <legend>Where you are now</legend>
                <div className="grid min-[561px]:grid-cols-2 gap-x-[18px] gap-y-4">
                  <div className="grid gap-1.5 field">
                    <label htmlFor="stage">Current level</label>
                    <select
                      id="stage"
                      name="stage"
                      required
                      aria-describedby="stage-error"
                    >
                      <option value="">Choose one</option>
                      <option>Grade 12</option>
                      <option>Undergraduate</option>
                      <option>Graduate</option>
                      <option>Postgraduate</option>
                      <option>Professional course</option>
                      <option>Looking for a job</option>
                      <option>Working, considering a change</option>
                    </select>
                    <span id="stage-error" className="err" role="alert">
                      Choose the current level.
                    </span>
                  </div>
                  <div className="grid gap-1.5 field">
                    <label htmlFor="service">
                      Service you're interested in{" "}
                      <span className="font-normal text-ink-soft text-[.85rem]">
                        (optional)
                      </span>
                    </label>
                    <select defaultValue={wanted} id="service" name="service">
                      <option value="">Not sure yet</option>
                      <optgroup label="Core services">
                        <option value="discovery">
                          Career Discovery &amp; Assessment
                        </option>
                        <option value="planning">
                          Career &amp; Education Planning
                        </option>
                        <option value="employability">
                          Employability &amp; Job Readiness
                        </option>
                      </optgroup>
                      <optgroup label="Packages">
                        <option value="profile-evaluation">
                          Profile Evaluation
                        </option>
                        <option value="online-tests">
                          Online Psychometric Testing
                        </option>
                        <option value="psychometric">
                          Psychometric Assessment &amp; Career Architecting
                        </option>
                        <option value="counselling">
                          Career Architecting Package
                        </option>
                        <option value="university">
                          University Admission Package
                        </option>
                        <option value="workshops">
                          Career Architecting Workshops
                        </option>
                      </optgroup>
                      <optgroup label="Overseas education">
                        <option value="overseas">
                          Overseas Education Solution
                        </option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="grid gap-1.5 field col-span-full">
                    <span
                      className="font-display font-bold text-[.95rem]"
                      id="help-label"
                    >
                      What do you need help with?{" "}
                      <span className="font-normal text-ink-soft text-[.85rem]">
                        (choose any)
                      </span>
                    </span>
                    <div
                      className="flex flex-wrap gap-2 checks"
                      role="group"
                      aria-labelledby="help-label"
                    >
                      <label>
                        <input
                          type="checkbox"
                          name="help"
                          value="Knowing my strengths"
                        />
                        <span>Knowing my strengths</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="help"
                          value="Choosing a career"
                        />
                        <span>Choosing a career</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="help"
                          value="Course or specialisation"
                        />
                        <span>Course or specialisation</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="help"
                          value="Choosing a college"
                        />
                        <span>Choosing a college</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="help"
                          value="Scholarships and loans"
                        />
                        <span>Scholarships &amp; loans</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="help"
                          value="Interview preparation"
                        />
                        <span>Interview preparation</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="help"
                          value="Resume and LinkedIn"
                        />
                        <span>Resume &amp; LinkedIn</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="help"
                          value="Finding a job"
                        />
                        <span>Finding a job</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid gap-1.5 field col-span-full">
                    <label htmlFor="message">
                      Anything else we should know?{" "}
                      <span className="font-normal text-ink-soft text-[.85rem]">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      maxLength={4000}
                      placeholder="Your interests, degree or course, colleges you're considering, roles you're applying for…"
                    ></textarea>
                  </div>
                </div>
              </fieldset>

              <div className="sr-only" aria-hidden="true">
                <label htmlFor="website">Leave this field empty</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              {submitError && (
                <p
                  role="alert"
                  className="mt-6 rounded-xl border border-placeholder-border bg-placeholder-bg p-4 text-error"
                >
                  {submitError} Your details have been kept so you can try
                  again.
                </p>
              )}
              <div className="mt-7 flex flex-wrap items-center gap-4 [&_small]:text-ink-soft [&_small]:text-[.88rem] [&_small]:max-w-[40ch]">
                <button
                  className="btn btn-primary disabled:opacity-60 disabled:cursor-wait"
                  type="submit"
                  disabled={pending}
                >
                  {pending ? "Saving your enquiry…" : "Request a call back"}{" "}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </button>
                <small>
                  We securely store your details and share them with our
                  counselling team through Google Sheets to respond to your
                  enquiry.
                </small>
              </div>
            </form>

            <div
              hidden={!success}
              className="mt-6 p-5 rounded-xl bg-success border-l-[6px] border-gold [&_h3]:mb-1.5"
              ref={successRef}
              id="form-success"
              tabIndex="-1"
              role="status"
            >
              <h3>Thank you. Your enquiry is saved.</h3>
              <p>
                Our counselling team will review your details and contact you to
                talk through your next step.
              </p>
            </div>
          </div>

          <aside className="grid gap-5 [&>img]:rounded-[14px] [&>img]:aspect-[4/3] [&>img]:object-cover [&>img]:w-full">
            <div className="bg-navy text-on-night rounded-[14px] p-[26px] grid gap-[18px] [&_h3]:text-paper [&_dt]:font-mono [&_dt]:text-[.74rem] [&_dt]:tracking-[.1em] [&_dt]:uppercase [&_dt]:text-gold [&_dd]:font-display [&_dd]:font-bold [&_dd]:text-[1.1rem] [&_dd]:text-paper [&_a]:no-underline [&_a:hover]:underline [&_dl]:grid [&_dl]:gap-3.5">
              <h3>Prefer to call?</h3>
              <dl>
                <div>
                  <dt>Phone &amp; WhatsApp</dt>
                  <dd>
                    <a href="tel:+918169055389">+91 81690 55389</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a
                      className="[overflow-wrap:anywhere]"
                      href="mailto:enquiry@elevantrainternational.com"
                    >
                      enquiry@elevantrainternational.com
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="bg-paper rounded-[14px] p-[26px] border border-rule [&_h3]:mb-3.5 [&_ol]:grid [&_ol]:gap-3.5 next-steps">
              <h3>What happens next</h3>
              <ol>
                <li>
                  <strong>We call you.</strong> A short call to understand where
                  you are and the decision ahead.
                </li>
                <li>
                  <strong>We recommend a starting point.</strong> Career
                  discovery, education planning or job readiness, depending on
                  where you are.
                </li>
                <li>
                  <strong>We map the route.</strong> You leave with a clear plan
                  for the next few steps.
                </li>
              </ol>
            </div>
            <img
              src="/assets/photo-standing-review.jpg"
              alt="A counsellor and a student reviewing options on a laptop"
              width="612"
              height="408"
              loading="lazy"
            />
          </aside>
        </div>
      </section>
    </>
  );
}
