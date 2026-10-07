import React from 'react';
import './DataStateMessage.css';

/**
 * Reusable component for displaying clean empty and error states
 * @param {Object} props
 * @param {'empty' | 'error'} [props.type='empty']
 * @param {string} [props.title]
 * @param {string} props.message
 * @param {() => void} [props.onRetry]
 * @param {boolean} [props.compact=false]
 */
export function DataStateMessage({
  type = 'empty',
  title,
  message,
  onRetry,
  compact = false
}) {
  const isError = type === 'error';
  const defaultTitle = isError ? 'Unable to Load Content' : 'No Items Available';

  return (
    <div
      className={`data-state-container ${isError ? 'error' : 'empty'} ${compact ? 'compact' : ''}`}
      role={isError ? 'alert' : 'status'}
    >
      <div className="data-state-icon-wrapper" aria-hidden="true">
        {isError ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        )}
      </div>

      <h3 className="data-state-title">{title || defaultTitle}</h3>
      <p className="data-state-message">{message}</p>

      {isError && onRetry && (
        <button type="button" onClick={onRetry} className="data-state-btn-retry">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export default DataStateMessage;
