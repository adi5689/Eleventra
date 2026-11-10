import { Link } from "react-router-dom";
export default function About() {
  return (
    <>
      <section className="pt-[clamp(48px,7vw,96px)] pb-[clamp(48px,6vw,80px)] [&_.grid]:grid-cols-1 min-[861px]:[&_.grid]:grid-cols-[1.1fr_.9fr] [&_.grid]:gap-[clamp(28px,5vw,72px)] [&_.grid]:items-center [&_h1]:text-[clamp(2.4rem,5.4vw,4.4rem)] [&_.lede]:mt-[22px] [&_img]:rounded-[14px] [&_img]:w-full [&_img]:aspect-[16/9] min-[861px]:[&_img]:aspect-[5/4] [&_img]:object-cover">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)] grid">
          <div>
            <p className="eyebrow">About Eleventra</p>
            <div className="mb-[22px] pl-4 border-l-4 border-gold max-w-[46ch]">
              <p className="font-display font-bold text-[1.12rem] leading-[1.4] text-ink [&_strong]:font-black [&_strong]:text-gold-text">
                <strong>Founded by four CXOs</strong> with over 80 years of
                combined experience in Banking &amp; Financial Services, IT,
                ITES and Education.
              </p>
            </div>
            <h1>We help students find the strengths marks don't show.</h1>
            <p className="text-[clamp(1.08rem,1.6vw,1.25rem)] text-ink-soft max-w-[38ch]">
              Eleventra is a career architecting practice in India. We help
              students understand what they're good at, build skills beyond
              academics, and choose a career path they can stand behind.
            </p>
          </div>
          <img
            src="/assets/photo-young-professional.jpg"
            alt="A student smiling at her phone in a café"
            width="612"
            height="408"
          />
        </div>
      </section>

      <section className="py-[clamp(72px,10vw,128px)] bg-night text-on-night [&_h2]:text-paper [&_h3]:text-paper [&_h4]:text-paper [&_.eyebrow]:text-gold">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="grid min-[821px]:grid-cols-2 gap-[clamp(32px,6vw,88px)] reveal">
            <article className="grid content-start gap-[18px] pt-7 border-t-[3px] border-gold [&+.mv-item]:border-on-night-soft [&_.eyebrow]:mb-0 mv-item">
              <p className="eyebrow">Our vision</p>
              <p className="font-display font-extrabold text-[clamp(1.45rem,2.6vw,2rem)] leading-[1.25] tracking-[-.01em] text-paper text-balance">
                A future where every student chooses a career with confidence,
                not guesswork, and steps into the workplace ready for it.
              </p>
              <p className="text-on-night-soft max-w-[46ch]">
                No student should pick a degree, a college or a job because of
                peer pressure, marks alone or a lack of information.
              </p>
            </article>
            <article className="grid content-start gap-[18px] pt-7 border-t-[3px] border-gold [&+.mv-item]:border-on-night-soft [&_.eyebrow]:mb-0 mv-item">
              <p className="eyebrow">Our mission</p>
              <p className="font-display font-extrabold text-[clamp(1.45rem,2.6vw,2rem)] leading-[1.25] tracking-[-.01em] text-paper text-balance">
                To help students and graduates understand their strengths, plan
                the education that leads to the right career, and build the
                skills employers look for.
              </p>
              <ul className="grid gap-2.5 [&_a]:font-display [&_a]:font-bold [&_a]:text-on-night [&_a]:no-underline [&_a]:inline-flex [&_a]:items-center [&_a]:gap-3 [&_a:hover]:underline mv-list">
                <li>
                  <Link to="/services">Career Discovery &amp; Assessment</Link>
                </li>
                <li>
                  <Link to="/services">Career &amp; Education Planning</Link>
                </li>
                <li>
                  <Link to="/services">Employability &amp; Job Readiness</Link>
                </li>
              </ul>
            </article>
          </div>
          <p className="mt-[clamp(48px,6vw,72px)] pt-6 border-t border-paper/15 font-mono font-semibold text-[.85rem] tracking-[.14em] uppercase text-gold reveal">
            Architecting careers. Building futures.
          </p>
        </div>
      </section>

      <section className="py-[clamp(72px,10vw,128px)] bg-paper">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="grid gap-[18px] mb-[clamp(36px,5vw,60px)] max-w-[760px] [&>p:not(.eyebrow)]:text-ink-soft [&>p:not(.eyebrow)]:text-[1.08rem] reveal">
            <p className="eyebrow navy">Our approach</p>
            <h2>Student first, career follows.</h2>
            <p>
              We don't start with a list of popular courses. We start with the
              student, and every recommendation traces back to what we learned
              about them.
            </p>
          </div>
          <ol className="approach reveal">
            <li>
              <span className="num">Step 1</span>
              <h3>Understand the student</h3>
              <p>
                Interests, preferences, talents, ambitions, and the subjects
                they enjoy or avoid.
              </p>
            </li>
            <li>
              <span className="num">Step 2</span>
              <h3>Identify strengths</h3>
              <p>
                Psychometric assessment of aptitude, interest and personality,
                alongside conversations with the student and family.
              </p>
            </li>
            <li>
              <span className="num">Step 3</span>
              <h3>Guide the choices</h3>
              <p>
                Career, course, specialisation and college, explained so the
                student understands why each choice fits.
              </p>
            </li>
            <li>
              <span className="num">Step 4</span>
              <h3>Build the career path</h3>
              <p>
                From the right course and college to the skills, interview
                practice and placement support for a first job.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="py-[clamp(72px,10vw,128px)]">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="grid gap-[18px] mb-[clamp(36px,5vw,60px)] max-w-[760px] [&>p:not(.eyebrow)]:text-ink-soft [&>p:not(.eyebrow)]:text-[1.08rem] reveal">
            <p className="eyebrow navy">What we believe</p>
            <h2>Three things we hold to.</h2>
          </div>
          <div className="grid min-[861px]:grid-cols-3 gap-[18px] reveal">
            <article className="bg-paper rounded-[14px] p-7 border-t-[6px] border-gold [&:nth-child(2)]:border-navy [&_h3]:mb-2.5 [&_p]:text-ink-soft [&_p]:text-[.98rem]">
              <h3>Honest advice</h3>
              <p>
                We recommend what fits the student, even when it's a less
                popular path or fewer sessions with us.
              </p>
            </article>
            <article className="bg-paper rounded-[14px] p-7 border-t-[6px] border-gold [&:nth-child(2)]:border-navy [&_h3]:mb-2.5 [&_p]:text-ink-soft [&_p]:text-[.98rem]">
              <h3>The student's choice, not the crowd's</h3>
              <p>
                Peers and relatives mean well. We help students make a decision
                based on their own aptitude and interests.
              </p>
            </article>
            <article className="bg-paper rounded-[14px] p-7 border-t-[6px] border-gold [&:nth-child(2)]:border-navy [&_h3]:mb-2.5 [&_p]:text-ink-soft [&_p]:text-[.98rem]">
              <h3>Here for the long run</h3>
              <p>
                We can work with a student from their first career assessment
                right through to their first job.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-[clamp(56px,7vw,88px)]">
        <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div className="bg-navy text-paper rounded-[28px] p-[clamp(36px,6vw,72px)] grid min-[821px]:grid-cols-[1.3fr_auto] gap-8 items-center relative overflow-hidden [&_h2]:text-paper [&_h2]:text-[clamp(1.8rem,3.6vw,2.7rem)] [&_p]:text-on-night-soft [&_p]:mt-3.5 [&_p]:max-w-[46ch] [&_.hero-actions]:relative [&_.hero-actions]:z-1 cta-band reveal">
            <div>
              <h2>Let's understand the student first.</h2>
              <p>
                A career assessment is the simplest way to start. It shows your
                strengths, then we plan from there.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="btn btn-gold" to="/contact?service=discovery">
                Book a career assessment{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link className="btn btn-ghost light" to="/services">
                See services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
