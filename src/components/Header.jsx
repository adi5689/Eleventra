import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/careers", "Career Options"],
  ["/contact", "Contact"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    function escape(event) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className="sticky top-0 z-50 bg-paper/94 backdrop-blur-[10px] backdrop-saturate-[1.4] border-b border-rule">
      <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)] flex items-center justify-between gap-6 min-h-[88px]">
        <Link
          to="/"
          className="block shrink-0"
          aria-label="Eleventra — Your Career Architect"
          onClick={() => setOpen(false)}
        >
          <img
            className="h-[52px] min-[1041px]:h-[72px] w-auto"
            src="/assets/logo-navy.png"
            alt="Eleventra — Your Career Architect"
            width="1200"
            height="920"
          />
        </Link>
        <button
          ref={toggle}
          type="button"
          className="min-[1041px]:hidden inline-flex items-center gap-2 px-3.5 py-2.5 border-2 border-navy rounded-full bg-paper font-display font-extrabold"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
        <nav
          id="site-nav"
          aria-label="Main"
          className={`${open ? "flex" : "hidden"} min-[1041px]:flex absolute left-0 right-0 top-full min-[1041px]:static flex-col min-[1041px]:flex-row items-stretch min-[1041px]:items-center gap-0 min-[1041px]:gap-1.5 bg-paper min-[1041px]:bg-transparent border-b border-rule min-[1041px]:border-0 pt-2 pb-5 px-[clamp(16px,4vw,40px)] min-[1041px]:p-0`}
        >
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              className="relative whitespace-nowrap font-display font-bold text-[1.1rem] min-[1041px]:text-[.98rem] no-underline px-2 py-3.5 min-[1041px]:px-3.5 min-[1041px]:py-2.5 rounded-lg min-[1041px]:rounded-full hover:bg-mist"
            >
              {label}
              {pathname === to && (
                <span
                  aria-hidden="true"
                  className="absolute size-2 rounded-full bg-paper border-[2.5px] border-gold right-3 top-1/2 -translate-y-1/2 min-[1041px]:right-auto min-[1041px]:left-1/2 min-[1041px]:-translate-x-1/2 min-[1041px]:top-auto min-[1041px]:bottom-[3px] min-[1041px]:translate-y-0"
                />
              )}
            </NavLink>
          ))}
          <Link
            to="/contact?service=discovery"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-2.5 min-[1041px]:mt-0 min-[1041px]:ml-2.5 min-h-11 px-[18px] justify-center min-[1041px]:whitespace-nowrap"
          >
            Book a career assessment
          </Link>
        </nav>
      </div>
    </header>
  );
}
