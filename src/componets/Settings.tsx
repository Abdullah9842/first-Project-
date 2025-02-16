// Settings.tsx
import React from 'react';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  return (
    <div className="absolute top-20 right-5 bg-white p-5 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-3">الإعدادات</h2>
      
      <button
        onClick={() => alert("Setting 1")}
        className="text-blue-500 hover:underline mb-2 block"
      >
        إعداد 1
      </button>
      <button
        onClick={() => alert("Setting 2")}
        className="text-blue-500 hover:underline mb-2 block"
      >
        إعداد 2
      </button>

      {/* زر إغلاق الإعدادات */}
      <button
        onClick={onClose}
        className="mt-4 text-gray-500 hover:text-black transition"
      >
        إغلاق
      </button>
    </div>
  );
};

export default Settings;
