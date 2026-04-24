import React from "react";
import { Link, useNavigate } from "react-router-dom";
import duckImg from "../../assets/full_duck.webp";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function showLogoFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.classList.add("landing-navbar__logo-img--hidden");
  const next = e.currentTarget.nextElementSibling;
  if (next) next.classList.add("landing-navbar__logo-fallback--visible");
}

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="landing-navbar">
      <Link to="/" className="landing-navbar__brand">
        <span className="landing-navbar__logo-wrap">
          <img
            src={duckImg}
            alt=""
            className="landing-navbar__logo-img"
            width={36}
            height={36}
            onError={showLogoFallback}
          />
          <span className="landing-navbar__logo-fallback" aria-hidden />
        </span>
        <span className="landing-navbar__wordmark">NurseSim+</span>
      </Link>
      <nav className="landing-navbar__nav" aria-label="Page sections">
        <button
          type="button"
          className="landing-navbar__link"
          onClick={() => scrollToSection("about")}
        >
          About
        </button>
        <button
          type="button"
          className="landing-navbar__link"
          onClick={() => scrollToSection("how-it-works")}
        >
          How it works
        </button>
        <button
          type="button"
          className="landing-navbar__link"
          onClick={() => scrollToSection("team")}
        >
          The team
        </button>
        <a
          className="landing-navbar__link landing-navbar__link--external"
          href="https://nursesim.plus"
          target="_blank"
          rel="noopener noreferrer"
        >
          nursesim.plus
        </a>
      </nav>
      <div className="landing-navbar__actions">
        <button
          type="button"
          className="landing-btn landing-btn--outline landing-btn--sm"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
        <button
          type="button"
          className="landing-btn landing-btn--primary landing-btn--sm"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </div>
    </header>
  );
};
