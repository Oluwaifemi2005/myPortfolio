import React from 'react';
import { Link } from 'react-router-dom';
import { profileData } from '../data/profileData';
import { skillsData } from '../data/skillsData';
import SectionHeader from '../components/SectionHeader';
import { useFeatured } from '../hooks/useFeatured';
import './HomePage.css';

function HomePage() {
  const { featuredProjects, latestShots } = useFeatured();

  return (
    <div className="home-page-root">
      {/* 1. Hero Section strictly matching Screenshot 1 */}
      <section className="hero-section" id="hero">
        <div className="container hero-container">
          <div className="hero-eyebrow">
            <span>{profileData.eyebrow}</span>
          </div>

          <h1 className="hero-headline">
            <span className="hero-headline-line">{profileData.headline.line1}</span>
            <span className="hero-headline-line">{profileData.headline.line2}</span>
          </h1>

          <p className="hero-disciplines">
            {profileData.disciplines.join('  •  ')}
          </p>

          <div className="hero-cta-wrapper">
            <a href="#about" className="hero-btn-cta">
              <span>See My Portfolio</span>
              <span className="hero-btn-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="8 12 12 16 16 12"></polyline>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. About Me Section strictly matching Screenshot 4 */}
      <section className="about-section" id="about">
        <div className="container about-container">
          <SectionHeader title="ABOUT ME" />

          <p className="about-bio">
            {profileData.bio}
          </p>

          <div className="about-divider">
            <span>| EXPLORE |</span>
          </div>

          {/* 3 Pillars Breakdown */}
          <div className="pillars-grid">
            {profileData.pillars.map(pillar => (
              <div key={pillar.id} className="pillar-card">
                <div className="pillar-header">
                  <span className="pillar-dot" aria-hidden="true"></span>
                  <h3 className="pillar-title">{pillar.title}</h3>
                </div>
                <p className="pillar-description">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Skills Section strictly matching Screenshot 4 */}
      <section className="skills-section" id="skills">
        <div className="container skills-container">
          <SectionHeader title="SKILLS" />

          {/* USING NOW */}
          <div className="skill-category-block">
            <h3 className="skill-category-title">USING NOW:</h3>
            <div className="skills-grid">
              {skillsData.usingNow.map(skill => (
                <div key={skill.name} className="skill-tile">
                  <span className="skill-tile-name">{skill.name}</span>
                  <span className="skill-tile-badge">{skill.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LEARNING */}
          <div className="skill-category-block">
            <h3 className="skill-category-title">LEARNING:</h3>
            <div className="skills-grid">
              {skillsData.learning.map(skill => (
                <div key={skill.name} className="skill-tile">
                  <span className="skill-tile-name">{skill.name}</span>
                  <span className="skill-tile-badge">{skill.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* OTHER SKILLS */}
          <div className="skill-category-block">
            <h3 className="skill-category-title">OTHER SKILLS:</h3>
            <div className="skills-grid">
              {skillsData.otherSkills.map(skill => (
                <div key={skill.name} className="skill-tile">
                  <span className="skill-tile-name">{skill.name}</span>
                  <span className="skill-tile-badge">{skill.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Software Section (Screenshot 4 Portfolio) */}
      <section className="home-software-section" id="software-preview">
        <div className="container home-software-container">
          <SectionHeader title="PORTFOLIO" subtitle="Selected software engineering projects" />

          <div className="featured-software-grid">
            {featuredProjects.map(project => (
              <article key={project.id} className="home-project-card">
                <div className="home-project-image-box">
                  <img src={project.image} alt={project.title} loading="lazy" />
                </div>
                <div className="home-project-content">
                  <h3 className="home-project-title">{project.title}</h3>
                  <p className="home-project-desc">{project.description}</p>
                  <div className="home-project-tags">
                    {project.tags.map(tag => (
                      <span key={tag} className="home-project-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="home-project-actions">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="home-project-btn-github"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="home-project-btn-demo"
                        aria-label={`View live demo of ${project.title}`}
                      >
                        <span>Live Demo</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="home-section-footer-cta">
            <Link to="/software" className="home-view-more-link">
              <span>EXPLORE ALL SOFTWARE PROJECTS</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. "Latest Shots" Photography Preview (Screenshot 3) */}
      <section className="home-photo-section" id="photo-preview">
        <div className="container home-photo-container">
          <div className="latest-shots-header">
            <div>
              <span className="latest-shots-badge">
                <span className="latest-shots-dot" aria-hidden="true"></span>
                Pro Photographer
              </span>
              <h2 className="latest-shots-title">Latest shots</h2>
            </div>
            <Link to="/photography" className="latest-shots-view-all">
              <span>View all</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          {/* 3 Photo Cards Row */}
          <div className="latest-shots-grid">
            {latestShots.map(photo => (
              <div key={photo.id} className="latest-shot-card">
                <div className="latest-shot-img-wrapper">
                  <img src={photo.image} alt={photo.title} loading="lazy" />
                  <div className="latest-shot-overlay">
                    <span className="latest-shot-category">{photo.category}</span>
                    <h3 className="latest-shot-card-title">{photo.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Editorial Tagline Quote */}
          <div className="photo-editorial-quote">
            <p>— Let's take your photographs to next level</p>
          </div>
        </div>
      </section>

      {/* 6. Contact CTA Banner */}
      <section className="home-contact-cta-section">
        <div className="container home-contact-cta-container">
          <SectionHeader title="GET IN TOUCH" />
          <h2 className="home-cta-headline">Have a project or photo shoot in mind?</h2>
          <p className="home-cta-text">
            Available for freelance software development and photography commissions worldwide.
          </p>
          <div className="home-cta-btn-wrapper">
            <Link to="/contact" className="home-cta-btn">
              Say Hello
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
