import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-night text-on-night-soft pt-[72px] pb-7">
      <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
        <div className="grid min-[521px]:grid-cols-2 min-[901px]:grid-cols-[1.3fr_1fr_1fr_1fr] gap-9 [&_img]:w-[180px] [&_p]:text-[.95rem] [&_p]:mt-4 [&_p]:max-w-[32ch] [&_h4]:text-paper [&_h4]:text-[.95rem] [&_h4]:mb-3.5 [&_ul]:grid [&_ul]:gap-2 [&_ul]:text-[.95rem] [&_a]:no-underline [&_a:hover]:text-paper [&_a:hover]:underline">
          <div>
            <img
              src="/assets/logo-white.png"
              alt="Eleventra — Your Career Architect"
              width="1200"
              height="910"
            />
            <p>
              Career assessment, education planning and job readiness for
              students, graduates and parents. Architecting careers, building
              futures.
            </p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li>
                <Link to="/services#packages">Packages</Link>
              </li>
              <li>
                <Link to="/services#overseas">Overseas education</Link>
              </li>
              <li>
                <Link to="/careers">Career options</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Eleventra</h4>
            <ul>
              <li>
                <Link to="/about">About us</Link>
              </li>
              <li>
                <Link to="/nep-2020">NEP2020</Link>
              </li>
              <li>
                <Link to="/contact">Contact form</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Talk to us</h4>
            <ul>
              <li>
                <a href="tel:+918169055389">+91 81690 55389</a>
              </li>
              <li>
                <a
                  className="[overflow-wrap:anywhere]"
                  href="mailto:enquiry@elevantrainternational.com"
                >
                  enquiry@elevantrainternational.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-[22px] border-t border-paper/12 flex flex-wrap justify-between gap-3 text-[.85rem]">
          <span>
            © <span id="year">2026</span> Eleventra Career Architects. India.
          </span>
          <div className="flex gap-6">
            <span>Your Career Architect</span>
            <Link to="/admin" className="hover:text-paper">
              Staff login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
