import React, { useState } from 'react';

const AddressDisplay = ({ value, type = 'address' }) => {
  const [copied, setCopied] = useState(false);

  const truncateAddress = (addr) => {
    if (!addr) return 'N/A';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getRamascanUrl = () => {
    if (!value || value === 'N/A') return '#';
    return `https://ramascan.com/${type}/${value}`;
  };

  if (!value || value === 'N/A') {
    return <span className="text-gray-500">N/A</span>;
  }

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <a
        href={getRamascanUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-admin-cyan dark:text-admin-cyan-dark hover:opacity-80 transition-opacity"
      >
        {truncateAddress(value)}
      </a>
      <button
        onClick={handleCopy}
        className={`text-xs px-2 py-0.5 rounded ${
          copied
            ? 'bg-admin-new-green/20 text-admin-new-green'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        } transition-colors`}
      >
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  );
};

export default AddressDisplay;