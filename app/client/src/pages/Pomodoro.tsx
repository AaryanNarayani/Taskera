import { useState, useEffect } from "react";
import { motion, useAnimation, AnimationControls } from "framer-motion";
import Play from "../components/playPause/Play";
import Pause from "../components/playPause/Pause";
import { Plus, RotateCcw } from "lucide-react";

interface PomodoroProps {
  duration?: number; // in seconds
  radius?: number;
}

export default function Pomodoro({
  duration = 25 * 60,
  radius = 60,
}: PomodoroProps): JSX.Element {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const controls: AnimationControls = useAnimation();
  const circumference: number = 2 * Math.PI * radius;

  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: any | undefined;

    if (isPlaying) {
      setStartTime(Date.now() - elapsedTime * 1000);

      interval = setInterval(() => {
        const elapsed: number = (Date.now() - (startTime ?? Date.now())) / 1000;
        setElapsedTime(elapsed);

        const progress: number = Math.min(1, elapsed / duration);
        const offset: number = circumference * (1 - progress);
        controls.set({ strokeDashoffset: offset });

        if (elapsed >= duration) {
          setIsPlaying(false);
          clearInterval(interval);
        }
      }, 16);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, startTime, duration, controls, circumference]);

  const togglePlay = (): void => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = (): void => {
    setIsPlaying(false);
    setElapsedTime(0);
    setStartTime(null);
    controls.set({ strokeDashoffset: circumference });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full px-4">
        <div className="flex items-center justify-center relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <h1 className="absolute text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-medium">
            {`${Math.floor((duration - Math.floor(elapsedTime)) / 60)
              .toString()
              .padStart(2, "0")}:${Math.floor(
              (duration - Math.floor(elapsedTime)) % 60
            )
              .toString()
              .padStart(2, "0")}`}
          </h1>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            className="select-none w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          >
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-[--secondary] rounded-full"
            />

            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              fill="none"
              className="text-[--background-2] rounded-full"
              style={{ rotate: 90, transformOrigin: "center", rotateX: 180 }}
              initial={{
                strokeDasharray: circumference,
                strokeDashoffset: circumference,
              }}
              animate={controls}
            />
          </svg>
        </div>
        
        {/* Controls moved outside the circle with more spacing */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 mt-2 sm:mt-4 md:mt-2 translate-y-[-20%]">
          <button
            onClick={togglePlay}
            className="scale-75 sm:scale-90 md:scale-100"
            aria-label={isPlaying ? "Pause timer" : "Start timer"}
          >
            {isPlaying ? 
              <div className="transform scale-75 sm:scale-90 md:scale-100">
                <Pause /> 
              </div> : 
              <div className="transform scale-75 sm:scale-90 md:scale-100">
                <Play />
              </div>
            }
          </button>
          {elapsedTime !== 0 && (
            <button onClick={handleReset} className="text-[--secondary]">
              <RotateCcw size={24} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
            </button>
          )}
        </div>
        
        <div className="flex justify-center mt-2 sm:mt-4">
          <button className="bg-[--secondary] w-fit text-[--ternary] px-3 py-1 sm:px-4 sm:py-2 rounded flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
            Add task<Plus size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </>
  );
}