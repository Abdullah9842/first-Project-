// صفحة جديدة للتحقق من الرابط الوارد
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "./firebase";
import { query, getDocs, where, addDoc, collection } from "firebase/firestore";


interface Users {
    userId: string;
    name: string;
    photoURL: string;
  }
  
const FriendshipRequestPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [senderData, setSenderData] = useState<Users | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const q = query(collection(db, "Users"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data() as Users;
        setSenderData(user);
      } else {
        navigate("/");
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const acceptRequest = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !senderData) return;

    // إضافة طلب الصداقة إلى Firebase
    await addDoc(collection(db, "FriendRequests"), {
      senderId: senderData.userId,
      receiverId: currentUser.uid,
      status: "pending",
    });

    alert("تم إرسال طلب الصداقة!");
    navigate("/");
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {senderData ? (
        <div>
          <h3>{senderData.name} يرغب في أن تكون صديقًا!</h3>
          <button onClick={acceptRequest} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            قبول طلب الصداقة
          </button>
        </div>
      ) : (
        <p>لا يوجد طلب صداقة موجه لك.</p>
      )}
    </div>
  );
};

export default FriendshipRequestPage;
