import { Link } from "react-router-dom";

const alignment = [
  [
    "Industry-Academia Integration",
    "We facilitate meaningful engagement between educational institutions and industry through corporate interactions, industry connect programmes, internships, live projects and expert-led sessions.",
  ],
  [
    "Skill Development & Employability",
    "We support the development of essential 21st-century competencies, including communication, critical thinking, problem-solving, leadership, digital literacy and professional readiness.",
  ],
  [
    "Career Guidance & Counselling",
    "We help students make informed academic and career decisions through career orientation, aptitude assessment, career counselling and exposure to emerging career opportunities.",
  ],
  [
    "Experiential & Practical Learning",
    "We encourage learning beyond textbooks through workshops, simulations, case-based learning, practical assignments, industry projects and real-world exposure.",
  ],
  [
    "Institutional Development & Academic Support",
    "We work with schools, colleges and universities to identify opportunities for strengthening their academic ecosystem through industry partnerships, skill-based initiatives, student engagement and career development programmes.",
  ],
  [
    "Entrepreneurship & Future Skills",
    "We promote entrepreneurial thinking, innovation, creativity and an understanding of emerging business and technology landscapes to prepare students for evolving career opportunities.",
  ],
];
const container = "w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]";

export default function NEP2020() {
  return (
    <>
      <section className="py-[clamp(48px,7vw,96px)]">
        <div
          className={`${container} grid min-[861px]:grid-cols-[1.2fr_.8fr] gap-[clamp(28px,5vw,64px)] items-center`}
        >
          <div>
            <p className="eyebrow">NEP 2020</p>
            <h1 className="text-[clamp(2.3rem,4.5vw,3.8rem)] text-balance">
              Empowering Education Through the Vision of NEP 2020
            </h1>
            <p className="mt-6 text-ink-soft text-[1.1rem] max-w-[60ch]">
              The National Education Policy (NEP) 2020 marks a significant shift
              in India's education ecosystem, moving beyond conventional
              classroom learning towards holistic development, multidisciplinary
              education, skill integration and experiential learning.
            </p>
          </div>
          <img
            src="/assets/photo-tablet-review.jpg"
            alt="A mentor and student exploring ideas together on a tablet"
            width="612"
            height="408"
            className="w-full aspect-[5/4] object-cover rounded-[24px]"
          />
        </div>
      </section>
      <section className="py-[clamp(48px,7vw,88px)] bg-night text-on-night">
        <div
          className={`${container} grid min-[821px]:grid-cols-2 gap-10 items-start`}
        >
          <div>
            <p className="eyebrow text-gold">Our perspective</p>
            <h2 className="text-paper text-[clamp(1.8rem,3.5vw,2.8rem)]">
              Connecting Education, Skills, Industry and Employability.
            </h2>
          </div>
          <div className="grid gap-5 text-on-night-soft text-[1.08rem]">
            <p>
              At{" "}
              <strong className="text-paper">
                Eleventra – Career Architects
              </strong>
              , we believe that the future of education lies in connecting
              academic knowledge with practical skills, industry exposure and
              meaningful career opportunities.
            </p>
            <p>
              Our services are designed to complement the vision of NEP 2020 by
              helping educational institutions, students and industry
              stakeholders build a more connected, inclusive and future-ready
              learning ecosystem.
            </p>
            <p>
              We aim to bridge the gap between{" "}
              <strong className="text-paper">
                Education, Skills, Industry and Employability.
              </strong>
            </p>
          </div>
        </div>
      </section>
      <section className="py-[clamp(56px,8vw,104px)] bg-mist">
        <div className={container}>
          <p className="eyebrow navy">Alignment</p>
          <h2 className="max-w-[24ch] mb-10">
            How Eleventra Aligns with NEP 2020
          </h2>
          <div className="grid min-[641px]:grid-cols-2 min-[1041px]:grid-cols-3 gap-5">
            {alignment.map(([title, description], index) => (
              <article
                key={title}
                className="bg-paper border border-rule rounded-[20px] p-[clamp(24px,3vw,32px)]"
              >
                <span className="font-mono text-gold-text text-[.85rem]">
                  0{index + 1}
                </span>
                <h3 className="mt-5 mb-3 text-[1.3rem]">{title}</h3>
                <p className="text-ink-soft">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="py-[clamp(56px,8vw,104px)]">
        <div
          className={`${container} grid min-[821px]:grid-cols-2 gap-[clamp(28px,5vw,64px)] items-center`}
        >
          <img
            src="/assets/photo-mentor-walkthrough.jpg"
            alt="A mentor reviewing a document with a young professional"
            width="612"
            height="408"
            loading="lazy"
            className="w-full aspect-[5/4] object-cover rounded-[24px]"
          />
          <div className="grid gap-5">
            <p className="eyebrow navy">Our commitment</p>
            <h2>From Education to Skills, and from Skills to Careers.</h2>
            <p className="text-ink-soft">
              At Eleventra, we see NEP 2020 not merely as an education policy
              but as an opportunity to transform how students learn, develop and
              prepare for their future.
            </p>
            <p className="text-ink-soft">
              Our endeavour is to create meaningful connections between
              institutions, learners and industry, enabling a transition from{" "}
              <strong>Education to Skills, and from Skills to Careers.</strong>
            </p>
            <p className="border-l-4 border-gold pl-5 font-display font-bold">
              Eleventra – Building Future-Ready Learners. Connecting Education
              with Opportunity.
            </p>
          </div>
        </div>
      </section>
      <section className={`${container} pb-[clamp(56px,7vw,88px)]`}>
        <div className="bg-navy text-on-night rounded-[28px] p-[clamp(28px,5vw,64px)] grid min-[821px]:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="text-paper">
              Bring NEP 2020 to life at your institution.
            </h2>
            <p className="text-on-night-soft mt-4 max-w-[60ch]">
              Talk to us about industry connect, skill-building and career
              guidance programmes for your students.
            </p>
          </div>
          <Link
            className="btn btn-gold justify-self-start"
            to="/contact?service=workshops"
          >
            Talk to us <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
