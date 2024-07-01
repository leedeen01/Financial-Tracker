import { useState, useEffect } from 'react';
import './Loader.css';

const Loader = () => {
  const [wait, setWait] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWait(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWait(false);
      setTimeoutReached(true);
    }, 60000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="loader-container">
      <div className="loader triangle">
        <svg viewBox="0 0 86 80">
          <polygon points="43 8 79 72 7 72"></polygon>
        </svg>
      </div>
      <br></br>
      {wait && (<p className='text-center'>Attempting to fetch data, please wait...</p>)}
      {timeoutReached && (<p className='text-center'>Something is wrong... try logging in again.</p>)}
    </div>
  );
};

export default Loader;