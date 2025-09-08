import React from 'react';
import CirclePosition from './CirclePosition';

const CircleDisplay = ({ circleDetails }) => {
  const getPositionStyle = (index) => {
    const totalPositions = 6;
    const angleStep = (2 * Math.PI) / totalPositions;
    const angle = index * angleStep - Math.PI / 2; // Start from top (subtract PI/2)
    
    return {
      position: 'absolute',
      left: `calc(50% + 42% * ${Math.cos(angle)})`,
      top: `calc(50% + 42% * ${Math.sin(angle)})`,
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <div className="relative w-full max-w-[600px] aspect-square mx-auto">
      {/* Circle Outline */}
      <div className="absolute inset-0 rounded-full border-2 border-admin-cyan/30 dark:border-admin-cyan-dark/30">
        {/* Center Position */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CirclePosition
            userId={circleDetails.centerUser?.userId || "Me"}
            positionNumber="C"
            isFilled={true}
          />
        </div>

        {/* Surrounding Positions */}
        {circleDetails.positions.map((position, index) => (
          <div key={index} style={getPositionStyle(index)}>
            <CirclePosition
              positionNumber={index + 1}
              userId={position?.userId}
              isFilled={!!position?.userId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircleDisplay;