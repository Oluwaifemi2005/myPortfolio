import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { profileData } from '../data/profileData';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page-root">
      <div className="container about-page-container">
        {/* Header */}
        <header className="about-page-header">
          <SectionHeader
            title="ABOUT ME"
            subtitle="The intersection of software engineering, design thinking, and visual storytelling."
          />
        </header>

        {/* Hero Bio & Portrait Split */}
        <section className="about-hero-split">
          {/* Portrait Column */}
          <div className="about-portrait-wrapper">
            <div className="about-portrait-frame">
              <img
                src={profileData.avatarImage}
                alt={profileData.name}
                className="about-portrait-img"
              />
              <div className="about-portrait-caption">
                <span className="about-portrait-name">{profileData.name}</span>
                <span className="about-portrait-role">{profileData.roles}</span>
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="about-narrative">
            <div className="about-narrative-eyebrow">
              <span>ONE CREATIVE BRAND</span>
            </div>

            <h2 className="about-narrative-headline">
              Analytical Precision Meets Artistic Direction.
            </h2>

            <p className="about-narrative-p">
              I am a software developer and professional photographer based in Nigeria. My work spans two complementary disciplines: architecting performant, accessible web applications and capturing compelling, cinematic portraits.
            </p>

            <p className="about-narrative-p">
              In software development, I focus on clean component architectures, robust frontend systems, and intuitive user experiences. I treat code as a craft, ensuring every interface is responsive, fast, and delightful to interact with.
            </p>

            <p className="about-narrative-p">
              In photography, my eye for composition, lighting, and color harmony informs how I perceive digital design. Whether directing a high-energy studio shoot or composing quiet urban scenes, I bring the same intentionality to each frame that I bring to each line of code.
            </p>

            {/* Quick Metrics */}
            <div className="about-highlights-grid">
              <div className="about-highlight-box">
                <span className="about-highlight-number">01</span>
                <h4 className="about-highlight-title">Software Engineering</h4>
                <p className="about-highlight-desc">React, modern JavaScript, component libraries, and clean code.</p>
              </div>
              <div className="about-highlight-box">
                <span className="about-highlight-number">02</span>
                <h4 className="about-highlight-title">Visual Photography</h4>
                <p className="about-highlight-desc">Editorial portraiture, natural & studio lighting, and color grading.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="about-actions-row">
              <Link to="/software" className="about-btn-primary">
                View Software Work
              </Link>
              <Link to="/photography" className="about-btn-secondary">
                View Photography
              </Link>
            </div>
          </div>
        </section>

        {/* The 3 Pillars Section */}
        <section className="about-pillars-section">
          <div className="about-pillars-header">
            <h3 className="about-pillars-section-title">THE THREE PILLARS</h3>
            <p className="about-pillars-section-sub">How I approach every client collaboration and creative venture.</p>
          </div>

          <div className="about-pillars-cards">
            {profileData.pillars.map(pillar => (
              <div key={pillar.id} className="about-pillar-card">
                <span className="about-pillar-tag">{pillar.title}</span>
                <p className="about-pillar-desc">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tooling & Hardware Section */}
        <section className="about-tooling-section">
          <div className="about-tooling-grid">
            {/* Tech Stack */}
            <div className="about-tooling-card">
              <h3 className="about-tooling-title">
                <span className="about-tooling-icon" aria-hidden="true">&#60;/&#62;</span>
                Development Stack
              </h3>
              <ul className="about-tooling-list">
                <li><strong>Languages & Markup:</strong> JavaScript (ES6+), TypeScript, HTML5, CSS3</li>
                <li><strong>Frontend Libraries:</strong> React, React Router, CSS Modules, Vite</li>
                <li><strong>Workflow & Design:</strong> Git, GitHub, Figma, VS Code</li>
                <li><strong>Architecture:</strong> Responsive layout, accessibility (a11y), clean state management</li>
              </ul>
            </div>

            {/* Photo Setup */}
            <div className="about-tooling-card">
              <h3 className="about-tooling-title">
                <span className="about-tooling-icon" aria-hidden="true">&#9673;</span>
                Photography & Creative Gear
              </h3>
              <ul className="about-tooling-list">
                <li><strong>Camera Systems:</strong> Mirrorless digital bodies with high dynamic range</li>
                <li><strong>Prime Optics:</strong> 35mm, 50mm, and 85mm portrait prime lenses</li>
                <li><strong>Post-Processing:</strong> Adobe Lightroom Classic, Photoshop, Capture One</li>
                <li><strong>Lighting:</strong> Continuous RGB studio lights, off-camera flash, and natural modifiers</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
