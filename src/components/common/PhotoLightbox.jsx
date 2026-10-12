import React, { useEffect, useRef } from 'react';
import './PhotoLightbox.css';

/**
 * Accessible, zero-dependency photo lightbox modal.
 *
 * @param {Object} props
 * @param {Array} props.photos - Array of photo objects currently displayed
 * @param {number|null} props.currentIndex - Zero-based index of the currently active photo
 * @param {Function} props.onClose - Callback triggered when the lightbox is closed
 * @param {Function} props.onNavigate - Callback triggered with new index when navigating
 */
function PhotoLightbox({ photos, currentIndex, onClose, onNavigate }) {
  const lightboxRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previousActiveElementRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  // Validate photo array and bounds
  const isValid =
    Array.isArray(photos) &&
    photos.length > 0 &&
    typeof currentIndex === 'number' &&
    currentIndex >= 0 &&
    currentIndex < photos.length;

  const currentPhoto = isValid ? photos[currentIndex] : null;
  const hasPrev = isValid && currentIndex > 0;
  const hasNext = isValid && currentIndex < photos.length - 1;

  // Save the trigger element and restore focus when closed
  useEffect(() => {
    if (!isValid) return;

    previousActiveElementRef.current = document.activeElement;
    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }

    return () => {
      if (
        previousActiveElementRef.current &&
        typeof previousActiveElementRef.current.focus === 'function'
      ) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isValid]);

  // Lock background scroll when open
  useEffect(() => {
    if (!isValid) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isValid]);

  // Keyboard navigation & focus trap
  useEffect(() => {
    if (!isValid) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (hasPrev) {
          onNavigate(currentIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (hasNext) {
          onNavigate(currentIndex + 1);
        }
      } else if (e.key === 'Tab') {
        if (!lightboxRef.current) return;
        const focusable = lightboxRef.current.querySelectorAll(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isValid, currentIndex, hasPrev, hasNext, onClose, onNavigate]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartXRef.current - touchEndX;
    const deltaY = touchStartYRef.current - touchEndY;

    // Detect horizontal swipe with higher delta than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0 && hasNext) {
        onNavigate(currentIndex + 1);
      } else if (deltaX < 0 && hasPrev) {
        onNavigate(currentIndex - 1);
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isValid || !currentPhoto) {
    return null;
  }

  return (
    <div
      className="photo-lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer lightbox"
      ref={lightboxRef}
      onClick={(e) => {
        // Close if click is directly on the backdrop/overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top Bar: Counter & Close Button */}
      <div className="photo-lightbox-topbar">
        <div className="photo-lightbox-counter" aria-live="polite">
          <span className="photo-lightbox-counter-current">{currentIndex + 1}</span>
          <span className="photo-lightbox-counter-divider">/</span>
          <span className="photo-lightbox-counter-total">{photos.length}</span>
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          className="photo-lightbox-btn photo-lightbox-btn-close"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Main Content Stage */}
      <div
        className="photo-lightbox-stage"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Previous Button */}
        <button
          type="button"
          className="photo-lightbox-btn photo-lightbox-btn-nav photo-lightbox-btn-prev"
          onClick={() => hasPrev && onNavigate(currentIndex - 1)}
          disabled={!hasPrev}
          aria-label="Previous photograph"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Image & Caption Wrapper */}
        <div
          className="photo-lightbox-figure-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="photo-lightbox-image-box">
            <img
              key={currentPhoto.id || currentPhoto.image}
              src={currentPhoto.image}
              alt={currentPhoto.title || 'Photograph'}
              className="photo-lightbox-image"
            />
          </div>

          {(currentPhoto.title || currentPhoto.category || currentPhoto.description) && (
            <div className="photo-lightbox-caption">
              {currentPhoto.category && (
                <span className="photo-lightbox-category">{currentPhoto.category}</span>
              )}
              {currentPhoto.title && (
                <h3 className="photo-lightbox-title">{currentPhoto.title}</h3>
              )}
              {currentPhoto.description && (
                <p className="photo-lightbox-description">{currentPhoto.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="photo-lightbox-btn photo-lightbox-btn-nav photo-lightbox-btn-next"
          onClick={() => hasNext && onNavigate(currentIndex + 1)}
          disabled={!hasNext}
          aria-label="Next photograph"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PhotoLightbox;
