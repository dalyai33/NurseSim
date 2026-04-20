import React from "react";

const team = [
  { initials: "KS", name: "Kiana Shim", role: "Lead UI/UX", mod: "ks" },
  { initials: "IH", name: "Ian Hale", role: "Team lead", mod: "ih" },
  { initials: "AD", name: "Aidan Daly", role: "QA / Frontend", mod: "ad" },
  { initials: "NI", name: "Nadir Isweesi", role: "Lead backend", mod: "ni" },
  { initials: "FM", name: "Francisco Martinez", role: "Database", mod: "fm" },
] as const;

export const TeamSection: React.FC = () => (
  <section
    id="team"
    className="landing-section landing-section--surface"
    aria-labelledby="team-heading"
  >
    <p className="landing-section__eyebrow">The team</p>
    <h2 id="team-heading" className="landing-section__h2">
      Who built it
    </h2>
    <p className="landing-section__sub">
      A five-person multidisciplinary team from OSU&apos;s CS senior capstone program, in
      collaboration with OHSU.
    </p>
    <div className="landing-team-grid">
      {team.map((m) => (
        <article key={m.initials} className="landing-team-card">
          <div
            className={`landing-team-card__avatar landing-team-card__avatar--${m.mod}`}
            aria-hidden
          >
            {m.initials}
          </div>
          <p className="landing-team-card__name">{m.name}</p>
          <p className="landing-team-card__role">{m.role}</p>
        </article>
      ))}
    </div>
    <div className="landing-partner-card">
      <div className="landing-partner-card__avatar" aria-hidden>
        KB
      </div>
      <div>
        <p className="landing-partner-card__name">Kirsten Buffa — Project partner</p>
        <p className="landing-partner-card__sub">
          Simulation Faculty Coordinator · OHSU School of Nursing, Monmouth
        </p>
      </div>
    </div>
  </section>
);
