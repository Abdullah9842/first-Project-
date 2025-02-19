

// import React, { useState, useEffect, ReactNode } from 'react';
// import { ThemeContext, Theme } from './themeContext';

// export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [theme, setTheme] = useState<Theme>('light');

//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', theme);
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       <div className="min-h-screen">
//         {children}
//       </div>
//     </ThemeContext.Provider>
//   );
// };
