import { PackageCard } from "../components/ContentCards";
import packages from "../data/packages.json";
import { Link } from "react-router-dom";
export default function Services() {
  return (
    <>
      <section className="pt-[clamp(48px,7vw,96px)] pb-[clamp(48px,6vw,80px)] [&_.grid]:grid-cols-1 min-[861px]:[&_.grid]:grid-cols-[1.1fr_.9fr] [&_.grid]:gap-[clamp(28px,5vw,72px)] [&_.grid]:items-center [&_h1]:text-[clamp(2.4rem,5.4vw,4.4rem)] [&_.lede]:mt-[22px] [&_img]:rounded-[14px] [&_img]:w-full [&_img]:aspect-[16/9] min-[861px]:[&_img]:aspect-[5/4] [&_img]:object-cover">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)] grid">
          <div>
            <p className="eyebrow">Services</p>
            <h1>Services for every stage.</h1>
            <p className="text-[clamp(1.08rem,1.6vw,1.25rem)] text-ink-soft max-w-[38ch]">
              Packages for every stage, plus support for studying abroad. Not
              sure which fits? Tell us where you are today.
            </p>
            <nav
              className="flex flex-wrap gap-2.5 mt-[30px]"
              aria-label="Services on this page"
            >
              <a className="chip" href="#packages">
                Packages
              </a>
              <a className="chip" href="#overseas">
                Overseas education
              </a>
            </nav>
          </div>
          <img
            src="/assets/photo-networking.jpg"
            alt="Students and a mentor talking in a bright open office"
            width="612"
            height="408"
          />
        </div>
      </section>

      <section className="py-[clamp(72px,10vw,128px)] bg-paper" id="packages">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="grid gap-[18px] mb-[clamp(36px,5vw,60px)] max-w-[760px] [&>p:not(.eyebrow)]:text-ink-soft [&>p:not(.eyebrow)]:text-[1.08rem] reveal">
            <p className="eyebrow navy">Packages</p>
            <h2>Pick a package that fits.</h2>
            <p>
              Six ways to work with us, from a first career conversation to
              university admissions support.
            </p>
          </div>
          <div className="grid min-[761px]:grid-cols-2 gap-[18px] reveal">
            {packages.map((item) => (
              <PackageCard key={item.title || item.name} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-[clamp(72px,10vw,128px)]" id="overseas">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="grid gap-[18px] mb-[clamp(36px,5vw,60px)] max-w-[760px] [&>p:not(.eyebrow)]:text-ink-soft [&>p:not(.eyebrow)]:text-[1.08rem] reveal">
            <p className="eyebrow">Study abroad</p>
            <h2>Your End-to-End Overseas Education Solution</h2>
            <p>
              We help you choose where to apply, submit your applications and
              plan how to pay for your studies.
            </p>
          </div>
          <ul className="grid min-[821px]:grid-cols-3 gap-4 [&>li]:bg-mist [&>li]:rounded-[14px] [&>li]:pt-7 [&>li]:px-[26px] [&>li]:pb-[30px] [&>li]:grid [&>li]:content-start [&>li]:gap-2.5 [&>li]:border-t-[5px] [&>li]:border-gold [&>li:nth-child(even)]:border-navy [&_h3]:text-xl [&_p]:text-ink-soft [&_p]:text-base reveal">
            <li>
              <h3>Institution Shortlisting</h3>
              <p>
                We assist in selecting the best-fit universities based on your
                academic goals and preferences.
              </p>
            </li>
            <li>
              <h3>Application Submissions</h3>
              <p>
                We streamline the application process, ensuring all required
                documents are submitted accurately and on time.
              </p>
            </li>
            <li>
              <h3>Education Loan Support</h3>
              <p>
                We guide you through education loan options, eligibility and
                paperwork, so you can plan how to fund your studies with
                confidence.
              </p>
            </li>
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-[18px] mt-[clamp(32px,4vw,48px)] reveal">
            <p className="font-display font-extrabold text-[clamp(1.1rem,1.8vw,1.3rem)] text-navy">
              Ready to study abroad? Start with a conversation.
            </p>
            <Link className="btn btn-primary" to="/contact?service=overseas">
              Plan your overseas education{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-[clamp(56px,7vw,88px)] bg-paper">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="bg-navy text-paper rounded-[28px] p-[clamp(36px,6vw,72px)] grid min-[821px]:grid-cols-[1.3fr_auto] gap-8 items-center relative overflow-hidden [&_h2]:text-paper [&_h2]:text-[clamp(1.8rem,3.6vw,2.7rem)] [&_p]:text-on-night-soft [&_p]:mt-3.5 [&_p]:max-w-[46ch] [&_.hero-actions]:relative [&_.hero-actions]:z-1 cta-band reveal">
            <div>
              <h2>Not sure which one fits?</h2>
              <p>
                Tell us where you are today, whether that's choosing a degree or
                applying for your first job. We'll suggest where to start.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="btn btn-gold" to="/contact">
                Ask a counsellor{" "}
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
