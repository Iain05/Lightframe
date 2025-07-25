import React, { useState } from 'react';

interface LightboxButtonProps {
  onClick: () => void;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

function LightboxButton({ onClick, style, icon }: LightboxButtonProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? '#fff' : '#D6D6D6',
        cursor: 'pointer',
        width: 32,
        height: 32,
        margin: 8,
        paddingTop: 2,
        ...style,
      }}
    >
      <span style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.8))' }}>
        {icon ? icon : 'Download'}
      </span>
    </button>
  );
}

export default LightboxButton;