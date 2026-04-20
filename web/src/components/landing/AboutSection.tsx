import React from "react";
import duckImg from "../../assets/Duck.png";

function BranchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 4v8M6 8h5a3 3 0 013 3v5M11 8a3 3 0 013-3h4M9 20h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TeacherIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#B45309"
        d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      />
    </svg>
  );
}

export const AboutSection: React.FC = () => (
  <section
    id="about"
    className="landing-section landing-section--white"
    aria-labelledby="about-heading"
  >
    <p className="landing-section__eyebrow">What is NurseSim+</p>
    <h2 id="about-heading" className="landing-section__h2">
      Clinical training, gamified
    </h2>
    <p className="landing-section__lead">
      Nursing students face high-stakes decisions from day one. NurseSim+ bridges the gap
      between classroom theory and real clinical practice through interactive patient
      scenarios, instant feedback, and AI-guided learning support.
    </p>
    <div className="landing-about-grid">
      <article className="landing-feature-card">
        <div className="landing-feature-card__icon landing-feature-card__icon--branch" aria-hidden>
          <BranchIcon />
        </div>
        <h3 className="landing-feature-card__title">Branching scenarios</h3>
        <p className="landing-feature-card__body">
          Make real clinical decisions — assessment, prioritization, medication — and see
          consequences play out based on your choices.
        </p>
      </article>
      <article className="landing-feature-card">
        <div className="landing-feature-card__icon landing-feature-card__icon--chat" aria-hidden>
          <img
            src={duckImg}
            alt=""
            className="landing-feature-card__duck-icon"
            width={28}
            height={28}
          />
        </div>
        <h3 className="landing-feature-card__title">AI hint chatbot</h3>
        <p className="landing-feature-card__body">
          &apos;Capstone&apos; guides you with hints and explanations — without ever leaking the
          answer in assessment mode.
        </p>
      </article>
      <article className="landing-feature-card">
        <div className="landing-feature-card__icon landing-feature-card__icon--teacher" aria-hidden>
          <TeacherIcon />
        </div>
        <h3 className="landing-feature-card__title">Teacher portal</h3>
        <p className="landing-feature-card__body">
          Instructors create classrooms, assign curriculum levels, and track student progress —
          all in one dashboard.
        </p>
      </article>
    </div>
  </section>
);
