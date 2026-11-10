import { QuoteCard } from "../components/ContentCards";
import quotes from "../data/quotes.json";
import { ServiceCard } from "../components/ContentCards";
import services from "../data/services.json";
import { StageCard } from "../components/ContentCards";
import stages from "../data/stages.json";
import { Link } from "react-router-dom";
import ContactWidget from "../components/ContactWidget";
export default function Home() {
  return (
    <>
      <ContactWidget />
      <section className="pt-[clamp(40px,6vw,80px)] pb-[clamp(40px,5vw,64px)]">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="grid min-[821px]:grid-cols-[1.25fr_.9fr] gap-[clamp(24px,5vw,72px)] items-end">
            <div>
              <p className="eyebrow">Career architecting</p>
              <h1>
                From <span className="text-gold-text">not sure</span>
                <br />
                to sorted.
              </h1>
            </div>
            <div className="grid gap-6 pb-2.5">
              <p className="text-[clamp(1.08rem,1.6vw,1.25rem)] text-ink-soft max-w-[38ch]">
                We help students and graduates understand their strengths,
                choose the right career, course and college, and get ready for
                the workplace.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="btn btn-primary"
                  to="/contact?service=discovery"
                >
                  Book a career assessment{" "}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
                <Link className="btn btn-ghost" to="/services">
                  See our services
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-[clamp(32px,5vw,56px)] bg-paper border border-rule rounded-3xl py-[clamp(28px,4vw,48px)] px-[clamp(20px,3vw,40px)] relative overflow-hidden">
            <ol
              className="path"
              aria-label="How Eleventra helps, in four steps"
            >
              <li style={{ "--i": "0" }}>
                <span className="tag-here">You are here</span>
                <span className="stop" aria-hidden="true"></span>
                <h3>Not sure yet</h3>
                <p>Too many options, or none that feel right.</p>
              </li>
              <li style={{ "--i": "1" }}>
                <span className="stop" aria-hidden="true"></span>
                <h3>Discover</h3>
                <p>
                  Assessments show your strengths, aptitude and interests, and
                  the career directions that suit you.
                </p>
                <Link to="/services">Career discovery →</Link>
              </li>
              <li style={{ "--i": "2" }}>
                <span className="stop" aria-hidden="true"></span>
                <h3>Plan</h3>
                <p>
                  Choose a career, then the course, specialisation and college
                  that lead to it.
                </p>
                <Link to="/services">Education planning →</Link>
              </li>
              <li className="end" style={{ "--i": "3" }}>
                <span className="stop" aria-hidden="true"></span>
                <h3>Sorted</h3>
                <p>
                  Job-ready, with the skills employers look for and support
                  through placement.
                </p>
                <Link to="/services">Job readiness →</Link>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="py-[clamp(56px,7vw,88px)]">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="grid gap-[18px] mb-[clamp(36px,5vw,60px)] max-w-[760px] [&>p:not(.eyebrow)]:text-ink-soft [&>p:not(.eyebrow)]:text-[1.08rem] reveal">
            <p className="eyebrow navy">Who we help</p>
            <h2>Start from where you are today.</h2>
          </div>
          <div className="grid min-[861px]:grid-cols-3 gap-3.5 reveal">
            {stages.map((item) => (
              <StageCard key={item.title || item.name} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-[clamp(72px,10vw,128px)] bg-paper">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="grid gap-[18px] mb-[clamp(36px,5vw,60px)] max-w-[760px] [&>p:not(.eyebrow)]:text-ink-soft [&>p:not(.eyebrow)]:text-[1.08rem] reveal">
            <p className="eyebrow">Services</p>
            <h2>Three ways we help.</h2>
            <p>
              Use one on its own, or follow all three from choosing a career to
              starting work.
            </p>
          </div>
          <div className="grid min-[901px]:grid-cols-3 gap-[clamp(16px,2.5vw,28px)]">
            {services.map((item) => (
              <ServiceCard key={item.title || item.name} {...item} />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 reveal">
            <Link className="btn btn-primary" to="/services">
              Compare the three services{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-[clamp(72px,10vw,128px)]">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="grid gap-[18px] mb-[clamp(36px,5vw,60px)] max-w-[760px] [&>p:not(.eyebrow)]:text-ink-soft [&>p:not(.eyebrow)]:text-[1.08rem] reveal">
            <p className="eyebrow">Students, parents &amp; graduates</p>
            <h2>Patrons speak.</h2>
          </div>
          <div className="grid min-[901px]:grid-cols-3 gap-[18px] reveal">
            {quotes.map((item) => (
              <QuoteCard key={item.title || item.name} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-[clamp(56px,7vw,88px)]">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="bg-navy text-paper rounded-[28px] p-[clamp(36px,6vw,72px)] grid min-[821px]:grid-cols-[1.3fr_auto] gap-8 items-center relative overflow-hidden [&_h2]:text-paper [&_h2]:text-[clamp(1.8rem,3.6vw,2.7rem)] [&_p]:text-on-night-soft [&_p]:mt-3.5 [&_p]:max-w-[46ch] [&_.hero-actions]:relative [&_.hero-actions]:z-1 cta-band reveal">
            <div>
              <h2>Not sure where to start?</h2>
              <p>
                Start with a career assessment. We'll show you your strengths
                and map out the next few steps.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="btn btn-gold" to="/contact?service=discovery">
                Book a career assessment{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
