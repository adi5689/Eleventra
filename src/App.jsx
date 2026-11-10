import { lazy, Suspense, useEffect, useRef } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
const Admin = lazy(() => import("./pages/Admin"));
const AssessmentBooking = lazy(() => import("./pages/AssessmentBooking"));
const NEP2020 = lazy(() => import("./pages/NEP2020"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const Careers = lazy(() => import("./pages/Careers"));
const titles = {
  "/": "Eleventra Career Architects — Career architecting in India",
  "/book-assessment": "Book a career assessment | Eleventra",
  "/nep-2020": "NEP 2020 — Eleventra Career Architects",
  "/about": "About Eleventra — Career Architects",
  "/services": "Services — Discovery, planning & job readiness | Eleventra",
  "/careers": "Career options | Eleventra",
  "/contact": "Contact — Request a call back | Eleventra",
};
export default function App() {
  const location = useLocation();
  const main = useRef(null);
  const isAdmin = location.pathname.startsWith("/admin");
  useEffect(() => {
    document.title = isAdmin
      ? "Enquiries · Eleventra Admin"
      : titles[location.pathname] || "Eleventra Career Architects";
    let observer;
    let hashPositioned = false;
    const positionHash = () => {
      if (!location.hash || hashPositioned) return;
      const target = document.getElementById(
        decodeURIComponent(location.hash.slice(1)),
      );
      if (target) {
        target.scrollIntoView();
        hashPositioned = true;
      }
    };
    const observe = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              observer.unobserve(entry.target);
            }
          }),
        { rootMargin: "0px 0px -8% 0px" },
      );
      main.current
        ?.querySelectorAll(".reveal:not(.in)")
        .forEach((element) => observer.observe(element));
      positionHash();
    };
    observe();
    const mutations = new MutationObserver(observe);
    mutations.observe(main.current, { childList: true, subtree: true });
    const frame = requestAnimationFrame(() => {
      if (location.hash) positionHash();
      else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => {
      observer?.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [location.pathname, location.hash, isAdmin]);
  return (
    <>
      <a
        href="#main"
        className="absolute -left-[999px] top-2 z-100 bg-navy text-paper px-4 py-2.5 rounded-lg focus:left-2"
      >
        Skip to content
      </a>
      {!isAdmin && <Header key={location.pathname} />}
      <main ref={main} id="main" tabIndex={-1} className="focus:outline-none">
        <Suspense
          fallback={
            <div
              role="status"
              className="max-w-[1200px] mx-auto p-10 min-h-[60vh]"
            >
              Loading…
            </div>
          }
        >
          <Routes>
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/" element={<Home />} />
            <Route path="/home.html" element={<Home />} />
            <Route path="/book-assessment" element={<AssessmentBooking />} />
            <Route path="/nep-2020" element={<NEP2020 />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route
              path="*"
              element={
                <section className="max-w-[1200px] mx-auto p-10 py-24">
                  <h1>Page not found.</h1>
                  <Link className="btn btn-primary mt-8" to="/">
                    Back to home
                  </Link>
                </section>
              }
            />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
