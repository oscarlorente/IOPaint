import React from 'react';
import * as Progress from '@radix-ui/react-progress';

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
    <Progress.Root 
      className="relative overflow-hidden bg-gray-900/80 rounded-full w-[300px] h-[16px]"
      style={{
        transform: 'translateZ(0)',
      }} 
      value={progress}
    >
      <Progress.Indicator
        className="bg-primary w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
};

export default ProgressBar;
