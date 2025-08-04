import React from 'react';
import './css/footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          <p>&copy; {currentYear} Iain Griesdale</p>
        </div>
        <div className="footer-links">
          <a 
            href="https://instagram.com/iain05" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
          >
            Instagram
          </a>
          <a 
            href="https://linkedin.com/in/iaingriesdale" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Connect on LinkedIn"
          >
            LinkedIn
          </a>
          <a 
            href="https://github.com/Iain05/lightframe" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="View our GitHub"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
