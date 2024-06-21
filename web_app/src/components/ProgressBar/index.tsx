import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import './styles.css';

const ProgressBar = () => {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    // Initial fast update to 66
    const timer = setTimeout(() => {
      setProgress(66);

      // Continuous slow increment after reaching 66
      const continuousTimer = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + Math.floor(Math.random() * (10 - 1 + 1)) + 1;
          if (newProgress >= 100) {
            clearInterval(continuousTimer);
            return 96;
          }
          return newProgress;
          
        });
      }, 4000); // Interval in milliseconds

    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Progress.Root className="ProgressRoot" value={progress}>
      <Progress.Indicator
        className="ProgressIndicator"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
};

export default ProgressBar;
