import React, { forwardRef } from 'react';

const CirclePosition = forwardRef(({ userId, positionNumber, isFilled }, ref) => {
  return (
    <div
      ref={ref}
      className={`
        w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center
        border-2 transition-all duration-300 relative z-10
        ${isFilled && userId !== '0'
          ? 'bg-admin-new-green/20 border-admin-new-green text-admin-new-green'
          : 'bg-white/50 dark:bg-gray-900/30 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'}
      `}
    >
      <div className="text-center">
        <div className="text-xl sm:text-2xl mb-1">👤</div>
        <div className="text-[10px] sm:text-xs font-medium">{isFilled ? userId : 'Empty'}</div>
      </div>
    </div>
  );
});

CirclePosition.displayName = 'CirclePosition';

export default CirclePosition;