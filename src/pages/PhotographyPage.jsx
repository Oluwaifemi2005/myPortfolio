import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { usePhotos } from '../hooks/usePhotos';
import './PhotographyPage.css';

function PhotographyPage() {
  const { photos } = usePhotos();

  return (
    <div className="photography-page-root">
      <div className="container photography-container">
        {/* Editorial Page Header matching Screenshot 3 */}
        <header className="photography-page-header">
          <div className="photography-badge-row">
            <span className="photography-pro-badge">
              <span className="photography-pro-dot" aria-hidden="true"></span>
              Pro Photographer
            </span>
          </div>

          <SectionHeader
            title="PHOTOGRAPHY ARCHIVE"
            subtitle="Creative portraiture, editorial lighting studies, and street photography exploring color, texture, and mood."
          />

          <div className="photography-quote-banner">
            <p className="photography-quote-text">
              &mdash; Let's take your photographs to next level
            </p>
          </div>
        </header>

        {/* Photography Showcase Grid */}
        <section className="photography-gallery-grid">
          {photos.map(photo => (
            <figure key={photo.id} className="photography-card">
              <div className="photography-img-box">
                <img
                  src={photo.image}
                  alt={photo.title}
                  loading="lazy"
                />
                <div className="photography-card-overlay">
                  <span className="photography-card-category">{photo.category}</span>
                  <h3 className="photography-card-title">{photo.title}</h3>
                  <p className="photography-card-desc">{photo.description}</p>
                </div>
              </div>
            </figure>
          ))}
        </section>

        {/* Photography Commission CTA Banner */}
        <aside className="photography-booking-banner">
          <div className="photography-booking-content">
            <span className="photography-booking-eyebrow">COMMISSIONS & SESSIONS</span>
            <h2 className="photography-booking-headline">Looking for a photographer for your next project?</h2>
            <p className="photography-booking-text">
              Available for editorial portraiture, brand campaigns, lookbooks, and private creative commissions.
            </p>
          </div>
          <div className="photography-booking-action">
            <Link to="/contact" className="photography-booking-btn">
              <span>Book a Session</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PhotographyPage;
