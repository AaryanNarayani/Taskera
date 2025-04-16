import { motion } from "framer-motion";
import { useState, useRef } from "react";
import GetMousePosition from "../../lib/GetMousePosition";

function ProgressBar({ progress }: { progress: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressPercentage = progress * 100;
  const progressPercentageShow =
    Math.round((progressPercentage + Number.EPSILON) * 100) / 100;
  const position = GetMousePosition();

  const getRelativeX = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return position.x - rect.left;
    }
    return position.x;
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-black/40 rounded-full h-1.5 relative"
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <motion.div
        className="bg-[--secondary] h-1.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
      ></motion.div>
      {isHovered && (
        <motion.div 
          className="absolute top-full mt-4 w-fit bg-black/70 text-white px-2 rounded text-xs md:text-sm"
          style={{
            x: getRelativeX(),
          }}
        >
          {progressPercentageShow}%
        </motion.div>
      )}
    </div>
  );
}

export default ProgressBar;