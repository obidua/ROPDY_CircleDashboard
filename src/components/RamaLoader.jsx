import React from 'react';

const RamaLoader = () => {
    return (
        <div className="h-[50px] m-0">
            <div className="w-[50px] mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280.72 280.48" className="w-full h-auto">
                    {/* Slow rotating white paths */}
                    <g className="animate-[spin_20s_linear_infinite] origin-[140px_140px]">
                        <path fill="white" d="M358.48,185.45A139.71,139.71,0,0,1,430.73,162v56a84,84,0,0,0-39.34,12.77Z" transform="translate(-296 -161.99)" />
                        <path fill="white" d="M304.69,253.53a140.71,140.71,0,0,1,44.68-61.45l32.91,45.29a84.72,84.72,0,0,0-24.34,33.46Z" transform="translate(-296 -161.99)" />
                        <path fill="white" d="M301.21,340.22a141.11,141.11,0,0,1,0-76l53.25,17.31a85.17,85.17,0,0,0,0,41.37Z" transform="translate(-296 -161.99)" />
                        <path fill="white" d="M349.37,412.39a140.71,140.71,0,0,1-44.68-61.45l53.25-17.3a84.61,84.61,0,0,0,24.34,33.45Z" transform="translate(-296 -161.99)" />
                        <path fill="white" d="M430.73,442.47A139.64,139.64,0,0,1,358.48,419l32.91-45.3a84,84,0,0,0,39.34,12.78Z" transform="translate(-296 -161.99)" />
                        <path fill="white" d="M514.25,419A139.64,139.64,0,0,1,442,442.47v-56a84,84,0,0,0,39.34-12.78Z" transform="translate(-296 -161.99)" />
                        <path fill="white" d="M568,350.94a140.71,140.71,0,0,1-44.68,61.45l-32.91-45.3a84.69,84.69,0,0,0,24.33-33.45Z" transform="translate(-296 -161.99)" />
                        <path fill="white" d="M571.52,264.24a141.37,141.37,0,0,1,0,76l-53.26-17.3a84.85,84.85,0,0,0,0-41.37Z" transform="translate(-296 -161.99)" />
                        <path fill="white" d="M523.36,192.08A140.71,140.71,0,0,1,568,253.53l-53.26,17.3a84.69,84.69,0,0,0-24.33-33.46Z" transform="translate(-296 -161.99)" />
                        <path fill="white" d="M442,162a139.74,139.74,0,0,1,72.25,23.46l-32.91,45.29A84.06,84.06,0,0,0,442,218Z" transform="translate(-296 -161.99)" />
                    </g>

                    {/* Static text */}
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white text-[22px] font-bold font-zilap"
                    >
                        RAMESTTA
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default RamaLoader;
