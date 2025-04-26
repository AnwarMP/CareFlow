
import React, { useEffect, useRef } from "react";

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
  animate?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size,
  strokeWidth,
  color,
  backgroundColor = "#e6e6e6",
  animate = true,
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (animate && circleRef.current) {
      circleRef.current.style.setProperty("--progress-value", `${(progress).toString()}`);
      circleRef.current.style.strokeDashoffset = `${offset}`;
    }
  }, [progress, circumference, animate, offset]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
      />
      <circle
        ref={circleRef}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={animate ? circumference : offset}
        className={animate ? "progress-ring-circle animate-circular-progress" : ""}
      />
    </svg>
  );
};

export default ProgressRing;
