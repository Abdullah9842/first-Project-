// import { createContext, useContext } from 'react';

// export type Theme = 'light' | 'dark' | 'pink';

// export interface ThemeContextType {
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
// }

// export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export const useTheme = (): ThemeContextType => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };
