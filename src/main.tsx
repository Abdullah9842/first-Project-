
// import { Provider } from "./components/ui/provider"
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//           <Provider>
//            <App />
//            </Provider>
//   </StrictMode>,
// )

// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import App from './App.tsx';
// import { ThemeProvider } from './componets/ThemeProvider.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>  {/* ضع StrictMode هنا */}
//     <ThemeProvider>  {/* تأكد أن ThemeProvider يحيط بـ App */}
//       <App />
//     </ThemeProvider>
//   </StrictMode>
// );
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
// import { ThemeProvider } from './componets/ThemeProvider'; // تأكد من المسار الصحيح

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <ThemeProvider> */}
      <App />
    {/* </ThemeProvider> */}
  </StrictMode>
);
