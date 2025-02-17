// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Profile from "./componets/Profile";
// import Login from "./componets/Login";
// import Signup from "./componets/SignUp";
// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
//     localStorage.getItem("isLoggedIn") === "true"
//   );
//   const [userEmail, setUserEmail] = useState<string>(
//     localStorage.getItem("userEmail") || ""

//   );
//   // تسجيل الدخول
//   const handleLogin = (email: string) => {
//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("userEmail", email);
//     setIsLoggedIn(true);
//     setUserEmail(email);
//   };

//   // تسجيل الخروج
//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("userEmail");
//     setIsLoggedIn(false);
//     setUserEmail("");
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* الصفحة الرئيسية */}
//         <Route
//           path="/"
//           element={
//             isLoggedIn ? (
//               <Navigate to={`/profile/${userEmail}`} />
//             ) : (
//               <Navigate to="/login" />
//             )
//           }
//         />

//         {/* صفحة تسجيل الدخول */}
//         <Route
//           path="/login"
//           element={
//             isLoggedIn ? (
//               <Navigate to={`/profile/${userEmail}`} />
//             ) : (
//               <Login onLogin={handleLogin} />
//             )
//           }
//         />

//         {/* صفحة التسجيل */}
//         <Route
//           path="/signup"
//           element={
//             isLoggedIn ? (
//               <Navigate to={`/profile/${userEmail}`} />
//             ) : (
//               <Signup               
            
              
//               onSignup={handleLogin} />
//             )
//           }
//         />

//         {/* صفحة الملف الشخصي */}
//         <Route
//           path="/profile/:email"
//           element={
//             isLoggedIn ? (
//               <Profile />
//             ) : (
//               <Navigate to="/login" />
//             )
//           }
//         />

//         {/* صفحة غير موجودة */}
//         <Route path="*" element={<div>404 - Page Not Found</div>} />
//       </Routes>

//       {/* زر تسجيل الخروج */}
//       {isLoggedIn && (
//         <button
//           onClick={handleLogout}
//           className="fixed bottom-5 left-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
//         >
//           Logout
//         </button>
//       )}
//     </Router>
//   );
// };

// export default App;



import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Profile from "./componets/Profile";
import Login from "./componets/Login";
import Signup from "./componets/SignUp"; // استيراد الكومبوننت بشكل صحيح

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem("isLoggedIn") === "true");
  const [userEmail, setUserEmail] = useState<string>(localStorage.getItem("userEmail") || "");

  const handleLogin = (email: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to={`/profile/${userEmail}`} /> : <Navigate to="/login" />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={`/profile/${userEmail}`} /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to={`/profile/${userEmail}`} /> : <Signup onSignup={handleLogin} />} />
        <Route path="/profile/:email" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      {isLoggedIn && (
        <button onClick={handleLogout} className="fixed bottom-5 left-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">
          Logout
        </button>
      )}
    </Router>
  );
};

export default App;

























// import { useEffect, useState } from "react";
// import { db } from "./componets/firebase";
// import { collection, getDocs,addDoc,updateDoc,doc, deleteDoc} from "firebase/firestore";
// import "./App.css";
// const App = () => {
//   const usersCollectionRef = collection(db, "users");
//   interface User {
//     id: string;
//     name: string;
//     age: number;
//   }

//   const [users, setusers] = useState<User[]>([]);
//   const [Newname, setNewName] = useState<string>("");
//   const [newAge, setNewAge] = useState<number>(0);
//   const createUser = async () => {
//     await addDoc(usersCollectionRef,{name: Newname, age: newAge})

//   };
//   const updateUser = async (id:string, age:number) =>{
//     const userDoc = doc(db, "users", id);
//      const newField = {age:age + 1};
//      await updateDoc(userDoc, newField)
//   }
//   const deleteUser = async (id:string) =>{
//     const userDoc = doc(db, "users", id)
//     await deleteDoc(userDoc)
//   }

//   useEffect(() => {
//     const getusers = async () => {
//       const data = await getDocs(usersCollectionRef);
//       setusers(
//         data.docs.map((doc) => ({
//           id: doc.id,
//           name: doc.data().name,
//           age: doc.data().age,
//         }))
//       );
//     };
//     getusers();
//   }, [usersCollectionRef]);

//   return (
//     <>
//       <input
//         type="text"
//         placeholder="name"
//         onChange={(e) => {
//           setNewName(e.target.value);
//         }}
//       />
//       <input
//         type="number"
//         placeholder="age"
//         onChange={(e) => {
//           setNewAge(Number(e.target.value));
//         }}
//       />
//       <button onClick={createUser}>create user</button>


//       <div>
//         {users.map((user) => (
//           <div key={user.id}>
//             <p className="mt-3.5 " > Name {user.name}</p>
//             <p className=""> age {user.age}</p>
//             <button className="bg-blue-500" onClick={() => {updateUser(user.id,user.age)}}>Increase</button>
//             <button className="bg-red-500" onClick={() => {deleteUser(user.id)}}>Delete</button>
//           </div>
//         ))}{" "}
//       </div>
//     </>
//   );
// };

// export default App;
