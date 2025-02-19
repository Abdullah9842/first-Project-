


// import React from 'react';

// interface SettingsProps {
//   onClose: () => void;
//   handleLogout: () => void;
// }

// const Settings: React.FC<SettingsProps> = ({ onClose, handleLogout }) => {
//   return (
//     <div className="fixed top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
//         {/* زر إغلاق الإعدادات */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-black transition text-lg"
//         >
//           ✖
//         </button>

//         <h2 className="text-lg font-bold mb-5 text-center">الإعدادات</h2>

//         {/* زر تسجيل الخروج */}
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition w-full"
//         >
//           تسجيل الخروج
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Settings;


import React from 'react';
// import { useTheme } from './themeContext'; // التأكد من الاستيراد الصحيح

interface SettingsProps {
  onClose: () => void;
  handleLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, handleLogout }) => {
  // const { theme, setTheme } = useTheme(); // التأكد من استخدام useTheme بشكل صحيح

  // const changeTheme = (newTheme: 'light' | 'dark' | 'pink') => {
  //   setTheme(newTheme); // تغيير الثيم عند الضغط على الزر
  // };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
        {/* زر إغلاق الإعدادات */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition text-lg"
        >
          ✖
        </button>

        <h2 className="text-lg font-bold mb-5 text-center">الإعدادات</h2>

        {/* زر تغيير الثيمات */}
        {/* <div className="space-y-4">
          <button
            onClick={() => changeTheme('light')}
            className={`px-4 py-2 rounded-full transition w-full ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            الثيم الفاتح
          </button>
          <button
            onClick={() => changeTheme('dark')}
            className={`px-4 py-2 rounded-full transition w-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}
          >
            الثيم الغامق
          </button>
          <button
            onClick={() => changeTheme('pink')}
            className={`px-4 py-2 rounded-full transition w-full ${theme === 'pink' ? 'bg-pink-600 text-white' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
          >
            الثيم الوردي
          </button>
        </div> */}

        {/* زر تسجيل الخروج */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition w-full mt-4"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default Settings;
