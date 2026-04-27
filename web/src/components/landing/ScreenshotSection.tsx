import React from "react";
import studentView from "../../assets/student_view.webp";
import teacherView from "../../assets/teacher_view.webp";
import chatbotView from "../../assets/chatbot_view.webp";

interface Screenshot {
  src: string;
  alt: string;
  title: string;
  description: string;
}

const screenshots: Screenshot[] = [
  {
    src: studentView,
    alt: "Student Simulation View",
    title: "Patient Simulation",
    description: "Interactive scenarios with real-time vitals and clinical decision-making.",
  },
  {
    src: teacherView,
    alt: "Teacher Dashboard View",
    title: "Teacher Dashboard",
    description: "Monitor student progress and review simulation performance at a glance.",
  },
  {
    src: chatbotView,
    alt: "AI Chatbot View",
    title: "AI Hint System",
    description: "Built-in assistant provides guided hints without giving away the answer.",
  },
];

export const ScreenshotsSection: React.FC = () => (
  <section className="landing-section landing-section--surface">
    <p className="landing-section__eyebrow">Preview</p>
    <h2 className="landing-section__h2">See It in Action</h2>
    <p className="landing-section__lead">
      A closer look at the core experiences inside NurseSim+.
    </p>
    <div className="landing-screenshots-grid">
      {screenshots.map((item, i) => (
        <div key={i} className="landing-screenshot-card">
          <div className="landing-screenshot-card__img-wrap">
            <img src={item.src} alt={item.alt} className="landing-screenshot-card__img" />
          </div>
          <div className="landing-screenshot-card__body">
            <h3 className="landing-screenshot-card__title">{item.title}</h3>
            <p className="landing-screenshot-card__desc">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);