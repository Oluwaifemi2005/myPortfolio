import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-page-root">
      <div className="container not-found-container">
        <SectionHeader title="404" subtitle="PAGE NOT FOUND" />
        <p className="not-found-message">
          The link you followed may be broken, or the page may have been moved or removed.
        </p>
        <Link to="/" className="not-found-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
