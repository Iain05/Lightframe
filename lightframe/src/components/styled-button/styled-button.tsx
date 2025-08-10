import React from 'react';
import './styled-button.css'; // Reuse button styles for now, or create a new css if needed

interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  icon?: React.ReactNode;
  text?: string;
  children?: React.ReactNode;
}

const StyledButton = React.forwardRef<HTMLButtonElement, StyledButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      className = '',
      icon,
      text,
      children,
      onClick,
      ...rest
    },
    ref
  ) => {
    const buttonClasses = `styled-btn styled-btn--${variant} styled-btn--${size} ${className}`.trim();
    return (
      <button ref={ref} className={buttonClasses} onClick={onClick} {...rest}>
        {icon && <span className="styled-btn__icon">{icon}</span>}
        {text && <span className="styled-btn__text">{text}</span>}
        {children}
      </button>
    );
  }
);

export default StyledButton;
