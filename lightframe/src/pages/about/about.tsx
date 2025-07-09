import React, { useEffect, useRef } from 'react';
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

  return (
    <div className="about-container" ref={aboutRef}>
      <div className="about-content">
        <div className="about-header fade-in-element">
          <h1>About Me</h1>
        </div>
        
        <div className="about-bio">
          <div className="bio-text fade-in-element">
            <p>
              My name is Iain Griesdale, I am a Computer Engineering student at the University of British Columbia, 
              and member of the VEXU Robotics Team <a href='https://tntnvex.com'>TNTN</a>.
            </p>

            <p>
              Most of my work is a mix of nature and urban photography, focusing on capturing people in places, but I really 
              enjoy all types of photography from landscapes to portraits. 
            </p>
            
            <p>
              I built this website myself over the course of a few weeks, and is still a work in progress. All the code
              is available on GitHub to see.
            </p>
          </div>
          
          <div className="bio-image fade-in-element">
            <div className="placeholder-image">
                <img src="/IMG_3232.JPEG" alt="Iain Griesdale" />
            </div>
          </div>
        </div>
        
        <div className="contact-section fade-in-element">
          <h2>Get In Touch</h2>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <a href="mailto:your.email@example.com" className="contact-link">
                igriesdale@gmail.com
              </a>
            </div>
            
            <div className="contact-item">
              <span className="contact-label">Location:</span>
              <span>Vancouver, British Columbia</span>
            </div>
          </div>
          
          <div className="social-links">
            <h3>Socials</h3>
            <div className="social-icons">
              <a 
                href="https://instagram.com/iain05" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                Instagram
              </a>
              <a 
                href="https://linkedin.com/in/iaingriesdale" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/Iain05/lightframe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
