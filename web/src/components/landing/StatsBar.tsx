import React from "react";

export const StatsBar: React.FC = () => (
  <section className="landing-stats" aria-label="Platform highlights">
    <div className="landing-stats__inner">
      <div className="landing-stats__grid">
        <div className="landing-stat-card">
          <div className="landing-stat-card__num">3</div>
          <div className="landing-stat-card__label">Curriculum levels</div>
        </div>
        <div className="landing-stat-card">
          <div className="landing-stat-card__num">AI</div>
          <div className="landing-stat-card__label">Powered hint chatbot</div>
        </div>
        <div className="landing-stat-card">
          <div className="landing-stat-card__num">OHSU</div>
          <div className="landing-stat-card__label">Partner verified</div>
        </div>
      </div>
    </div>
  </section>
);
