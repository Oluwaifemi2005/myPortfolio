import React from 'react';
import { profileData } from '../data/profileData';
import './Footer.css';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-root">
      <div className="container footer-container">
        {/* Back to top button matching Screenshot 4 */}
        <button
          type="button"
          onClick={scrollToTop}
          className="footer-back-to-top"
          aria-label="Scroll back to top"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <span>BACK TO TOP</span>
        </button>

        {/* Direct Contact & Social Links */}
        <div className="footer-social-links">
          {/* Email */}
          <a
            href={profileData.socials.emailLink}
            className="footer-social-item"
            aria-label="Send Email directly"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href={profileData.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-item"
            aria-label="Chat on WhatsApp"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.37 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.33C9.36 7.33 9.08 7.39 8.84 7.65C8.61 7.9 7.94 8.52 7.94 9.8C7.94 11.08 8.87 12.31 9 12.49C9.14 12.67 10.79 15.22 13.32 16.31C13.92 16.57 14.39 16.73 14.75 16.84C15.36 17.04 15.91 17 16.35 16.94C16.84 16.87 17.86 16.32 18.07 15.72C18.28 15.13 18.28 14.62 18.21 14.51C18.15 14.4 18 14.34 17.72 14.2C17.44 14.06 16.08 13.39 15.82 13.3C15.57 13.2 15.39 13.16 15.21 13.43C15.03 13.7 14.52 14.3 14.36 14.48C14.21 14.67 14.05 14.69 13.77 14.55C13.49 14.41 12.6 14.12 11.55 13.18C10.73 12.45 10.17 11.55 10.01 11.27C9.85 11 10 10.84 10.14 10.7C10.27 10.57 10.43 10.36 10.57 10.2C10.71 10.04 10.76 9.92 10.85 9.74C10.94 9.56 10.9 9.4 10.83 9.26C10.76 9.13 10.25 7.87 10.04 7.36C9.83 6.86 9.62 6.93 9.46 6.92L9.53 7.33Z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a
            href={profileData.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-item"
            aria-label="Direct message on Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          {/* X / Twitter */}
          <a
            href={profileData.socials.x}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-item"
            aria-label="Direct message on X"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* GitHub */}
          <a
            href={profileData.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-item"
            aria-label="GitHub Profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>

        {/* Copyright notice */}
        <p className="footer-copyright">
          &copy; {currentYear} {profileData.name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
