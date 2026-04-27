import React from "react";
import { useNavigate } from "react-router-dom";
import duckImg from "../../assets/full_duck_head.webp";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function showDuckFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.classList.add("landing-hero__duck-img--hidden");
  const next = e.currentTarget.nextElementSibling;
  if (next) next.classList.add("landing-hero__duck-fallback--visible");
}

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="landing-hero" aria-labelledby="landing-hero-heading">
      <div className="landing-hero__duck" aria-hidden>
        <img
          src={duckImg}
          alt="NurseSim+ duck mascot"
          className="landing-hero__duck-img"
          width={72}
          height={72}
          onError={showDuckFallback}
        />
        <span className="landing-hero__duck-fallback" aria-hidden />
      </div>
      <span className="landing-hero__badge">
        <span className="landing-hero__badge-dot" aria-hidden />
        Oregon State University · Senior Capstone 2026
      </span>
      <h1 id="landing-hero-heading" className="landing-hero__title">
        <span className="landing-hero__title-line">Practice nursing skills.</span>
        <br />
        <span className="landing-hero__title-accent">Build real confidence.</span>
      </h1>
      <p className="landing-hero__sub">
        NurseSim+ is a gamified clinical simulation platform for OHSU nursing students —
        practice patient assessment, clinical judgment, and prioritization in a safe,
        repeatable environment.
      </p>
      <div className="landing-hero__actions">
        <button
          type="button"
          className="landing-btn landing-btn--primary landing-btn--hero"
          onClick={() => navigate("/login")}
        >
          Play
        </button>
        <button
          type="button"
          className="landing-btn landing-btn--outline landing-btn--hero"
          onClick={() => scrollToSection("about")}
        >
          Learn more
        </button>
      </div>
    </section>
  );
};
