import React, { useState } from 'react';
import '@styles/globals.css'; // Create this CSS file for styling

const WaveButton = () => {
  const [wave, setWave] = useState(false);

  const handleClick = () => {
    setWave(true);
    setTimeout(() => {
      setWave(false);
    }, 1000); // Adjust the duration of the wave effect
  };

  return (
    <button className={`wave-button ${wave ? 'active' : ''}`} onClick={handleClick}>
      Click Me
    </button>
  );
};

export default WaveButton;
