import React from 'react';

const Logo: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src="https://i.imgur.com/NGGaZIi.jpeg" 
        alt="Cricket Logo"
        width={99}
        height={43}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};

export default Logo;
