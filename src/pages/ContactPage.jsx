import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import SectionHeader from '../components/SectionHeader';
import { profileData } from '../data/profileData';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'software', // 'software' | 'photography' | 'both'
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleServiceChange = (serviceType) => {
    setFormData(prev => ({ ...prev, service: serviceType }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    // 1. Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, and Message).');
      return;
    }

    // 2. Validate email format
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // 3. Check for EmailJS environment configuration
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setErrorMsg(
        'EmailJS configuration is missing. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file.'
      );
      return;
    }

    // 4. Send via EmailJS with loading state
    setIsSubmitting(true);
    setErrorMsg('');

    const visitorName = formData.name.trim();
    const visitorEmail = formData.email.trim();
    const visitorPhone = formData.phone.trim() || 'Not provided';
    const visitorService =
      formData.service === 'software'
        ? 'Software Development'
        : formData.service === 'photography'
        ? 'Photography Session'
        : 'Both / Collaboration';

    const templateParams = {
      // Identity & Contact details
      from_name: visitorName,
      name: visitorName,
      visitor_name: visitorName,

      from_email: visitorEmail,
      email: visitorEmail,
      visitor_email: visitorEmail,
      reply_to: visitorEmail, // Configures Reply-To header in EmailJS

      phone: visitorPhone,
      visitor_phone: visitorPhone,
      service: visitorService,
      message: formData.message.trim(),

      // Destination & Subject
      to_email: profileData.socials.email,
      to_name: profileData.name || 'Portfolio Admin',
      subject: `New Contact Form Message — ${visitorName}`
    };

    try {
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (response.status === 200 || response.text === 'OK') {
        setSubmitted(true);
      } else {
        throw new Error('Email service returned an unexpected response code.');
      }
    } catch (err) {
      setErrorMsg(
        err?.text ||
        err?.message ||
        'Failed to deliver message through EmailJS. Please verify your internet connection or email configuration.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      service: 'software',
      phone: '',
      message: ''
    });
    setSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div className="contact-page-root">
      <div className="container contact-container">
        <header className="contact-header">
          <SectionHeader
            title="CONTACT"
            subtitle="Have a software project, photography commission, or creative inquiry? Leave your details below."
          />
        </header>

        <div className="contact-layout">
          {/* Main Form Box */}
          <div className="contact-form-card">
            {submitted ? (
              <div className="contact-success-state">
                <div className="contact-success-icon" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="contact-success-title">Message Sent Successfully!</h3>
                <p className="contact-success-text">
                  Thank you, <strong>{formData.name}</strong>. Your message regarding{' '}
                  <span className="contact-success-highlight">
                    {formData.service === 'software'
                      ? 'Software Development'
                      : formData.service === 'photography'
                      ? 'Photography Session'
                      : 'Both Disciplines'}
                  </span>{' '}
                  has been delivered to <strong>{profileData.socials.email}</strong>. I will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="contact-btn-reset"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                {/* Inquiry Service Selector */}
                <div className="contact-service-selector">
                  <label className="contact-field-label">I'M INTERESTED IN:</label>
                  <div className="contact-service-pills" role="radiogroup" aria-label="Service of interest">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.service === 'software'}
                      disabled={isSubmitting}
                      className={`service-pill-btn ${formData.service === 'software' ? 'active' : ''}`}
                      onClick={() => handleServiceChange('software')}
                    >
                      Software Development
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.service === 'photography'}
                      disabled={isSubmitting}
                      className={`service-pill-btn ${formData.service === 'photography' ? 'active' : ''}`}
                      onClick={() => handleServiceChange('photography')}
                    >
                      Photography Session
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.service === 'both'}
                      disabled={isSubmitting}
                      className={`service-pill-btn ${formData.service === 'both' ? 'active' : ''}`}
                      onClick={() => handleServiceChange('both')}
                    >
                      Both / Collaboration
                    </button>
                  </div>
                </div>

                {/* Minimal Underline Input Fields matching Screenshot 4 */}
                <div className="contact-input-group">
                  <label htmlFor="name" className="contact-underline-label">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="contact-underline-input"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="contact-input-group">
                  <label htmlFor="email" className="contact-underline-label">
                    YOUR EMAIL *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="contact-underline-input"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="contact-input-group">
                  <label htmlFor="phone" className="contact-underline-label">
                    PHONE NUMBER (OPTIONAL)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="contact-underline-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="contact-input-group">
                  <label htmlFor="message" className="contact-underline-label">
                    YOUR MESSAGE *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, timeline, or photo session ideas..."
                    className="contact-underline-textarea"
                    disabled={isSubmitting}
                    required
                  ></textarea>
                </div>

                {errorMsg && (
                  <div className="contact-error-banner" role="alert">
                    {errorMsg}
                  </div>
                )}

                {/* Centered | SUBMIT | Button matching Screenshot 4 */}
                <div className="contact-submit-wrapper">
                  <button
                    type="submit"
                    className="contact-btn-submit"
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    <span className="contact-btn-bracket">|</span>
                    <span>{isSubmitting ? 'SENDING...' : 'SUBMIT'}</span>
                    <span className="contact-btn-bracket">|</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Direct Details Sidebar */}
          <aside className="contact-sidebar">
            <div className="contact-sidebar-card">
              <h3 className="contact-sidebar-title">DIRECT CHANNELS</h3>
              <p className="contact-sidebar-p">
                Prefer direct messaging or chatting? Feel free to reach out directly through any of the channels below.
              </p>

              {/* Email */}
              <div className="contact-detail-item">
                <span className="contact-detail-label">EMAIL:</span>
                <a href={profileData.socials.emailLink} className="contact-detail-link">
                  {profileData.socials.email}
                </a>
              </div>

              {/* WhatsApp */}
              <div className="contact-detail-item">
                <span className="contact-detail-label">WHATSAPP:</span>
                <a
                  href={profileData.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-detail-link"
                >
                  {profileData.socials.whatsappNumber} (Chat Directly)
                </a>
              </div>

              {/* Instagram */}
              <div className="contact-detail-item">
                <span className="contact-detail-label">INSTAGRAM DM:</span>
                <a
                  href={profileData.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-detail-link"
                >
                  {profileData.socials.instagramHandle}
                </a>
              </div>

              {/* X / Twitter */}
              <div className="contact-detail-item">
                <span className="contact-detail-label">X / TWITTER DM:</span>
                <a
                  href={profileData.socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-detail-link"
                >
                  {profileData.socials.xHandle}
                </a>
              </div>

              {/* Status */}
              <div className="contact-detail-item">
                <span className="contact-detail-label">STATUS:</span>
                <span className="contact-detail-status">
                  <span className="status-ping" aria-hidden="true"></span>
                  Available for Select Projects
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
