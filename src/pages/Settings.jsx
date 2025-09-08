import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Switch } from '@headlessui/react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';



const contractAddresses = {
  ROPDY_VIEW: "0x6D126941B21cC0e32b8b128851a3Ef9A72587fC1",
  ROPDY_ROOT: "0x478F02521e5A86D4bFEbaF0730446E2B45b3e95d",
  ROPDY_PRICECONV: "0xA7ECB3E3f34108C4f8F729Af3e317Ba9a4B3fF6C"
};




const Settings = () => {
  const { isDark, toggleTheme } = useTheme();


  const [copiedLabel, setCopiedLabel] = useState(null);

  const copyToClipboard = (label, text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedLabel(label);
          setTimeout(() => setCopiedLabel(null), 2000); // remove after 2 sec
        })
        .catch((err) => console.error("Failed to copy:", err));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedLabel(label);
        setTimeout(() => setCopiedLabel(null), 2000);
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      }
      document.body.removeChild(textArea);
    }
  };
  

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-6">
        <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">⚙️ Settings</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Account Status" value="Active" />
          {/* <StatCard label="Last Login" value="2023-12-05" />
          <StatCard label="Security Level" value="2FA Enabled" /> */}
        </div>

        <div className="max-w-2xl">
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30">
            <h2 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Appearance</h2>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                className={`${isDark ? 'bg-admin-new-green' : 'bg-gray-400'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-admin-new-green focus:ring-offset-2`}
              >
                <span
                  className={`${isDark ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>
        </div>


        <div className="bg-white/50 mt-10 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30">
          <h2 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Contract Addresses</h2>
          <div className="space-y-4">
            {Object.entries(contractAddresses).map(([label, address]) => (
              <div key={label} className="flex justify-between items-center text-sm sm:text-base text-black dark:text-white bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <div className="flex flex-col">
                  <span className="font-semibold">{label}</span>
                  <span className="text-xs break-all">{address}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(label, address)}
                  className="ml-4 px-3 py-1 text-xs bg-admin-new-green text-white rounded hover:bg-green-700 relative"
                >
                  {copiedLabel === label ? "Copied!" : "Copy"}
                </button>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;