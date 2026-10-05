import React from 'react';
import './SectionHeader.css';

function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header-root">
      <div className="section-header-frame">
        <h2 className="section-header-title">{title}</h2>
      </div>
      {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
    </div>
  );
}

export default SectionHeader;
