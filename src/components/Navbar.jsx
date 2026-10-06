import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand identity: Avatar + Name & Subtitle */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="navbar-avatar">
            <img src="/images/portrait.jpg" alt="Brian" />
          </div>
          <div className="navbar-brand-info">
            <span className="navbar-brand-name">Manny Tech & Imagery</span>
            <span className="navbar-brand-role">Developer & Photographer</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/software"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Software
          </NavLink>
          <NavLink
            to="/photography"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Photography
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            About
          </NavLink>
          <Link to="/contact" className="nav-btn-cta">
            Say Hello
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="navbar-hamburger mobile-only"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            /* Close "X" icon */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            /* Hamburger icon matching Screenshot 1 */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="7" x2="20" y2="7"></line>
              <line x1="8" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="17" x2="20" y2="17"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="mobile-nav-menu mobile-only">
          <nav className="mobile-nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/software"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Software
            </NavLink>
            <NavLink
              to="/photography"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Photography
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              About
            </NavLink>
            <Link to="/contact" className="mobile-nav-btn-cta" onClick={closeMenu}>
              Say Hello
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
