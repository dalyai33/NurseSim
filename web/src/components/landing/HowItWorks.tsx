import React from "react";

const steps = [
  {
    num: "01",
    title: "Sign up",
    desc: "Create your OHSU account as a student or instructor",
  },
  {
    num: "02",
    title: "Tutorial",
    desc: "Learn the interface and unlock curriculum levels",
  },
  {
    num: "03",
    title: "Enter the ward",
    desc: "Work through branching patient scenarios",
  },
  {
    num: "04",
    title: "Get feedback",
    desc: "Scores, correct actions, and AI hints",
  },
  {
    num: "05",
    title: "Track progress",
    desc: "Completion markers persist across sessions",
  },
] as const;

export const HowItWorks: React.FC = () => (
  <section
    id="how-it-works"
    className="landing-section landing-section--surface"
    aria-labelledby="how-heading"
  >
    <p className="landing-section__eyebrow">How it works</p>
    <h2 id="how-heading" className="landing-section__h2">
      From login to clinical confidence
    </h2>
    <ol className="landing-how-strip">
      {steps.map((s) => (
        <li key={s.num} className="landing-how-step">
          <p className="landing-how-step__num">{s.num}</p>
          <p className="landing-how-step__title">{s.title}</p>
          <p className="landing-how-step__desc">{s.desc}</p>
        </li>
      ))}
    </ol>
  </section>
);
