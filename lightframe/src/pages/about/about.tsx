import React, { useEffect, useRef } from 'react';
import config from '@src/config';
import './about.css';

const About: React.FC = () => {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px',
      }
    );

    // Add staggered animation delays
    const animateElements = () => {
      const elements = aboutRef.current?.querySelectorAll('.fade-in-element');
      elements?.forEach((element, index) => {
        (element as HTMLElement).style.transitionDelay = `${index * 0.2}s`;
        observer.observe(element);
      });
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(animateElements, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const { paragraphs, profilePhoto, email, location, socials } = config.about;
  const hasBio = (paragraphs && paragraphs.length > 0) || profilePhoto;
  const hasContact = email || location || (socials && socials.length > 0);

  return (
    <div className="about-container" ref={aboutRef}>
      <div className="about-content">
        <div className="about-header fade-in-element">
          <h1>About Me</h1>
        </div>

        {hasBio && (
          <div className="about-bio">
            {paragraphs && paragraphs.length > 0 && (
              <div className="bio-text fade-in-element">
                {paragraphs.map((item, index) => (
                  <p key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </div>
            )}

            {profilePhoto && (
              <div className="bio-image fade-in-element">
                <div className="placeholder-image">
                    <img src={profilePhoto} alt={config.name} />
                </div>
              </div>
            )}
          </div>
        )}

        {hasContact && (
          <div className="contact-section fade-in-element">
            <h2>Get In Touch</h2>
            <div className="contact-info">
              {email && (
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <a href={`mailto:${email}`} className="contact-link">
                    {email}
                  </a>
                </div>
              )}

              {location && (
                <div className="contact-item">
                  <span className="contact-label">Location:</span>
                  <span>{location}</span>
                </div>
              )}
            </div>

            {socials && socials.length > 0 && (
              <div className="social-links">
                <h3>Socials</h3>
                <div className="social-icons">
                  {socials.map((social) => (
                    <a
                      key={social.url}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
