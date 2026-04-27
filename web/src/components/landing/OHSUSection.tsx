import React from "react";

export const OHSUSection: React.FC = () => (
  <section className="landing-section landing-section--white" aria-labelledby="ohsu-heading">
    <p className="landing-section__eyebrow">Built for OHSU</p>
    <h2 id="ohsu-heading" className="landing-section__h2">
      Designed with nursing educators
    </h2>
    <p className="landing-section__lead">
      NurseSim+ was built in partnership with the OHSU School of Nursing Simulation Lab to
      align with real curriculum requirements and NCLEX competencies.
    </p>
    <div className="landing-ohsu-callout">
      <p className="landing-ohsu-callout__text">
        All scenarios use fictional, HIPAA-compliant case data — no real patient information
        is ever used or stored.
      </p>
      <div className="landing-ohsu-pills">
        <span className="landing-ohsu-pill">OHSU Simulation Lab</span>
        <span className="landing-ohsu-pill">Oregon State University</span>
      </div>
    </div>
  </section>
);
