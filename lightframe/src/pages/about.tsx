import React from 'react';
import './about.css';
import profileImage from '../images/IMG_3232.JPEG';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <div className="about-header">
          <h1>About Me</h1>
        </div>
        
        <div className="about-bio">
          <div className="bio-image">
            <div className="placeholder-image">
                <img src={profileImage} alt="Iain Griesdale" />
            </div>
          </div>
          
          <div className="bio-text">
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
        </div>
        
        <div className="contact-section">
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
