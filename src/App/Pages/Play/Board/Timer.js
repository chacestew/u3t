import React, { useState, useEffect } from 'react';

const Timer = ({ turnStartTime }) => {
  const [time, setTime] = useState(null);
  useEffect(() => {
    setTime(Math.floor((turnStartTime - new Date().getTime() + 60000) / 1000));

    const interval = setInterval(() => {
      setTime(t => t - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [turnStartTime]);
  return time ? <span>Time left: {time}</span> : null;
};

export default Timer;
