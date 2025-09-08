import React from 'react';
import RamaLogo from '../assets/rama_logo.png';
import RamaLoader from './RamaLoader';

const RamaCard = ({ label, value }) => (
    <div className="flex items-center gap-4 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-admin-new-green/30 hover:border-admin-new-green hover:shadow-xl hover:shadow-admin-new-green/20 transition-all duration-300">
        <div className="flex-shrink-0 bg-black rounded-full dark:bg-transparent">
            {/* <img className="w-12 dark:bg-transparent bg-black h-12 object-contain" src={RamaLogo} alt="Rama Logo" /> */}

            <RamaLoader />
        </div>
        <div className="flex flex-col">
            <h3 className="text-base text-admin-cyan dark:text-admin-cyan-dark font-medium">{label}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
        </div>
    </div>
);

export default RamaCard;



export const EarnedRamaCard = ({ label, value }) => (
    <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-5 rounded-lg shadow-lg border border-admin-new-green/30 hover:border-admin-new-green hover:shadow-xl hover:shadow-admin-new-green/20 transition-all duration-300">
        <h3 className="text-base text-admin-cyan dark:text-admin-cyan-dark">{label}</h3>
        <p className="text-2xl font-bold  text-purple-600 mt-2">{value}</p>
    </div>
);
