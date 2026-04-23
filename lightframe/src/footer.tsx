import React from 'react';
import config from '@src/config';
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
          {config.socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${social.label}`}
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;