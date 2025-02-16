// // SignUp.tsx
// import React, { useState } from "react";

// interface SignUpProps {
//   onSignUp: (email: string, password: string) => void;
// }

// const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [name, setName] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!name || !email || !password) {
//       setErrorMessage("All fields are required!");
//       return;
//     }

//     // يمكنك إضافة التحقق من صحة البريد الإلكتروني وكلمة المرور هنا

//     onSignUp(email, password);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-200">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

//         {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-sm">Name</label>
//             <input
//               type="text"
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <button
//             type="submit"
//             className="bg-blue-500 text-white w-full p-2 rounded-md"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

// SignUp.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // تحقق من التسجيل هنا (مثل إرسال البيانات إلى الخادم)
    // هنا نعتبر أن التسجيل تم بنجاح
    console.log("تم التسجيل بنجاح!");
    
    // بعد نجاح التسجيل، نوجه المستخدم إلى صفحته الخاصة
    navigate(`/profile/${email}`);
  };

  return (
    <div className="signup-container">
      <h1>صفحة التسجيل</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>البريد الإلكتروني:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>كلمة المرور:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="submit-button">تسجيل</button>
      </form>
    </div>
  );
};

export default SignUp;
