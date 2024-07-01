import { useState, useEffect } from 'react';
import './Loader.css';

const Loader = () => {
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000);

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
      {timeoutReached && (<p className='text-center'>Something is wrong... try logging in again.</p>)}
    </div>
  );
};

export default Loader;