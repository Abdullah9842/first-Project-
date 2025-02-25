// import { useState, useEffect } from "react";
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase";
// import { auth } from "./firebase";

// export interface Friend {
//   userId1: string;
//   userId2: string;
// }

// export const useFriends = () => {
//   const [friends, setFriends] = useState<Friend[]>([]);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const friendsRef = collection(db, "Friends");

//     const q1 = query(friendsRef, where("userId1", "==", user.uid));
//     const q2 = query(friendsRef, where("userId2", "==", user.uid));

//     const unsubscribe1 = onSnapshot(q1, (snapshot) => {
//       setFriends((prev) => [
//         ...prev.filter((f) => f.userId2 !== user.uid), // منع التكرار
//         ...snapshot.docs.map((doc) => doc.data() as Friend),
//       ]);
//     });

//     const unsubscribe2 = onSnapshot(q2, (snapshot) => {
//       setFriends((prev) => [
//         ...prev.filter((f) => f.userId1 !== user.uid), // منع التكرار
//         ...snapshot.docs.map((doc) => doc.data() as Friend),
//       ]);
//     });

//     return () => {
//       unsubscribe1();
//       unsubscribe2();
//     };
//   }, []);

//   return { friends };
// };import { useState, useEffect } from "react";

// import { useState, useEffect } from "react";
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase";
// import { auth } from "./firebase";

// export interface Friend {
//   userId1: string;
//   userId2: string;
//   friendId?: string;  // إضافة خاصية friendId
// }

// export const useFriends = () => {
//   const [friends, setFriends] = useState<Friend[]>([]);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const friendsRef = collection(db, "Friends");

//     // استعلام للأصدقاء الذين لديهم userId1 كـ currentUser
//     const q1 = query(friendsRef, where("userId1", "==", user.uid));
//     // استعلام للأصدقاء الذين لديهم userId2 كـ currentUser
//     const q2 = query(friendsRef, where("userId2", "==", user.uid));

//     // الاستماع للأصدقاء في الجانب الأول (userId1)
//     const unsubscribe1 = onSnapshot(q1, (snapshot) => {
//       const updatedFriends1 = snapshot.docs.map((doc) => doc.data() as Friend);
//       setFriends((prev) => [
//         ...prev.filter((f) => f.userId2 !== user.uid), // إزالة الأصدقاء الذين تم إضافتهم سابقًا
//         ...updatedFriends1,
//       ]);
//     });

//     // الاستماع للأصدقاء في الجانب الثاني (userId2)
//     const unsubscribe2 = onSnapshot(q2, (snapshot) => {
//       const updatedFriends2 = snapshot.docs.map((doc) => doc.data() as Friend);
//       setFriends((prev) => [
//         ...prev.filter((f) => f.userId1 !== user.uid), // إزالة الأصدقاء الذين تم إضافتهم سابقًا
//         ...updatedFriends2,
//       ]);
//     });

//     return () => {
//       unsubscribe1();
//       unsubscribe2();
//     };
//   }, []);

//   // دمج الأصدقاء بحيث يظهر لكل طرف الأصدقاء بناءً على userId1 و userId2
//   const combinedFriends = friends.map((friend) => {
//     if (friend.userId1 === auth.currentUser?.uid) {
//       return { ...friend, friendId: friend.userId2 };
//     } else if (friend.userId2 === auth.currentUser?.uid) {
//       return { ...friend, friendId: friend.userId1 };
//     }
//     return friend;
//   });

//   // إزالة الأصدقاء المكررين
//   const distinctFriends = Array.from(new Set(combinedFriends.map((f) => f.friendId)))
//     .map((friendId) => combinedFriends.find((f) => f.friendId === friendId));

//   return { friends: distinctFriends };
// };









// import { useState, useEffect } from "react";
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase";
// import { auth } from "./firebase";

// export interface Friend {
//   id: string;
//   userId1: string;
//   userId2: string;
  
// }

// export const useFriends = () => {
//   const [friends, setFriends] = useState<Friend[]>([]);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const friendsRef = collection(db, "Friends");

//     // Query for friends where userId1 is currentUser
//     const q1 = query(friendsRef, where("userId1", "==", user.uid));
//     // Query for friends where userId2 is currentUser
//     const q2 = query(friendsRef, where("userId2", "==", user.uid));

//     // Listen for friends on the first side (userId1)
//     const unsubscribe1 = onSnapshot(q1, (snapshot) => {
//       const updatedFriends1 = snapshot.docs.map((doc) => doc.data() as Friend);
//       setFriends((prev) => [
//         ...prev.filter((f) => f.userId2 !== user.uid), // Remove already added friends
//         ...updatedFriends1,
//       ]);
//     });

//     // Listen for friends on the second side (userId2)
//     const unsubscribe2 = onSnapshot(q2, (snapshot) => {
//       const updatedFriends2 = snapshot.docs.map((doc) => doc.data() as Friend);
//       setFriends((prev) => [
//         ...prev.filter((f) => f.userId1 !== user.uid), // Remove already added friends
//         ...updatedFriends2,
//       ]);
//     });

//     return () => {
//       unsubscribe1();
//       unsubscribe2();
//     };
//   }, []);

//   // Combine friends to ensure both sides are covered (userId1 and userId2)
//   const combinedFriends = friends.map((friend) => {
//     if (friend.userId1 === auth.currentUser?.uid) {
//       return { ...friend, friendId: friend.userId2 };
//     } else if (friend.userId2 === auth.currentUser?.uid) {
//       return { ...friend, friendId: friend.userId1 };
//     }
//     return friend;
//   });

//   // Remove duplicates using a Map for friendId
//   const uniqueFriends = new Map();
//   combinedFriends.forEach((friend) => {
//     if (!uniqueFriends.has(friend.id)) {
//       uniqueFriends.set(friend.id, friend);
//     }
//   });

//   const distinctFriends = Array.from(uniqueFriends.values());

//   return { distinctFriends };
// };
