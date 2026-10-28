import { Link } from "react-router-dom";
export function StageCard({ grade, title, text, action }) {
  return (
    <Link
      to="/services"
      className="bg-paper border border-rule rounded-[14px] pt-6 px-[22px] pb-[22px] flex flex-col gap-2.5 no-underline transition duration-200 hover:border-navy hover:-translate-y-[3px]"
    >
      <span className="font-mono font-bold text-[.78rem] tracking-[.1em] uppercase text-gold-text">
        {grade}
      </span>
      <h3 className="text-xl">{title}</h3>
      <p className="text-ink-soft text-[.97rem]">{text}</p>
      <span className="mt-auto pt-2 font-display font-extrabold text-navy">
        {action}
      </span>
    </Link>
  );
}
export function ServiceCard({ image, alt, title, text }) {
  return (
    <article className="reveal flex flex-col min-[601px]:max-[900px]:grid min-[601px]:max-[900px]:grid-cols-[.9fr_1.1fr] bg-mist rounded-[14px] overflow-hidden">
      <img
        src={image}
        alt={alt}
        width="612"
        height="408"
        loading="lazy"
        className="aspect-[3/2] object-cover w-full min-[601px]:max-[900px]:h-full min-[601px]:max-[900px]:aspect-auto"
      />
      <div className="pt-6 px-6 pb-7 flex flex-col gap-3 flex-1">
        <h3>{title}</h3>
        <p className="text-ink-soft text-[.98rem]">{text}</p>
        <Link to="/services" className="text-link mt-auto self-start">
          See our services
        </Link>
      </div>
    </article>
  );
}
export function QuoteCard({ text, name, detail }) {
  return (
    <figure className="bg-paper rounded-[14px] p-7 flex flex-col gap-5 border-2 border-dashed border-rule">
      <span className="placeholder self-start">
        Replace with a real testimonial
      </span>
      <blockquote className="m-0 text-[1.05rem] text-ink-soft italic">
        {text}
      </blockquote>
      <figcaption className="mt-auto font-display font-extrabold">
        {name}
        <span className="block font-mono font-medium text-[.78rem] text-ink-soft">
          {detail}
        </span>
      </figcaption>
    </figure>
  );
}
export function PackageCard({
  id,
  category,
  title,
  description,
  items,
  note,
  href,
  action,
}) {
  return (
    <article
      id={id}
      className="bg-paper border border-rule rounded-[14px] p-7 flex flex-col gap-4 scroll-mt-[110px]"
    >
      <span className="font-mono font-bold text-[.76rem] tracking-[.08em] uppercase text-gold-text">
        {category}
      </span>
      <h3 className="text-2xl">{title}</h3>
      <p className="text-ink-soft">{description}</p>
      <ul
        className={`ticks text-[.95rem] ${id === "online-tests" ? "gold" : ""}`}
      >
        {items.map((item) => (
          <li key={item}>
            {item.includes(":") ? (
              <>
                <strong>{item.split(":")[0]}:</strong>
                {item.slice(item.indexOf(":") + 1)}
              </>
            ) : (
              item
            )}
          </li>
        ))}
      </ul>
      {note && (
        <p className="text-[.92rem] bg-mist rounded-[10px] py-3 px-3.5 text-ink border-l-[5px] border-navy">
          <strong className="font-display">{note.split(".")[0]}.</strong>
          {note.slice(note.indexOf(".") + 1)}
        </p>
      )}
      <div className="mt-auto pt-1.5 flex flex-wrap gap-2.5">
        <Link
          className="btn btn-primary min-h-11 px-[18px] text-[.95rem]"
          to={href}
        >
          {action}
        </Link>
      </div>
    </article>
  );
}
