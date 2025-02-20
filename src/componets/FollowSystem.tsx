








import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase"; // تأكد من تعديل المسار حسب ملف Firebase الخاص بك
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

// Define User type based on your Firestore schema
interface Users {
  userId: string;
  username: string;
}

// Define FriendRequest type for handling friend requests
interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
}

// Define Friend type for existing friends
interface Friend {
  userId1: string;
  userId2: string;
}

const FriendSystem: React.FC = () => {
  const [friendUsername, setFriendUsername] = useState("");
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]); // حفظ الأصدقاء الحاليين
  const [loading, setLoading] = useState(false);
  const currentUser = auth.currentUser;  // Ensure that auth is initialized

  // Send a friend request to another user
  const sendFriendRequest = async () => {
    if (!currentUser || !friendUsername) return;
    setLoading(true);
    try {
      // Find the user by username
      const q = query(collection(db, "Users"), where("userId", "==", friendUsername));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        alert("المستخدم غير موجود!");
        return;
      }

      const receiver = querySnapshot.docs[0].data() as Users;

      // Check if a request already exists
      const requestQuery = query(
        collection(db, "FriendRequests"),
        where("senderId", "==", currentUser.uid),
        where("receiverId", "==", receiver.userId)
      );
      const requestSnapshot = await getDocs(requestQuery);
      if (!requestSnapshot.empty) {
        alert("لقد أرسلت طلب صداقة مسبقًا!");
        return;
      }

      // Send the friend request
      await addDoc(collection(db, "FriendRequests"), {
        senderId: currentUser.uid,
        receiverId: receiver.userId,
        status: "pending",
      });
      alert("تم إرسال طلب الصداقة!");
      setFriendUsername("");
    } catch (error) {
      console.error("خطأ أثناء إرسال الطلب: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch incoming friend requests
  useEffect(() => {
    if (!currentUser) return;
    const fetchRequests = async () => {
      const q = query(
        collection(db, "FriendRequests"),
        where("receiverId", "==", currentUser.uid),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      const requestList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FriendRequest));
      setRequests(requestList);
    };

    // Fetch current friends
    const fetchFriends = async () => {
      const q = query(
        collection(db, "Friends"),
        where("userId2", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const friendList = querySnapshot.docs.map(doc => doc.data() as Friend);
      setFriends(friendList);
    };

    fetchRequests();
    fetchFriends();
  }, [currentUser]);

  // Accept a friend request
  const acceptFriendRequest = async (request: FriendRequest) => {
    try {
      await updateDoc(doc(db, "FriendRequests", request.id), { status: "accepted" });
      await addDoc(collection(db, "Friends"), {
        userId1: request.senderId,
        userId2: request.receiverId,
      });
      alert("تم قبول طلب الصداقة!");
      setRequests(requests.filter(req => req.id !== request.id));
    } catch (error) {
      console.error("خطأ أثناء القبول: ", error);
    }
  };

  // Reject a friend request
  const rejectFriendRequest = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, "FriendRequests", requestId));
      alert("تم رفض طلب الصداقة!");
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error("خطأ أثناء الرفض: ", error);
    }
  };

  // Remove a friend
  const removeFriend = async (friend: Friend) => {
    try {
      const q = query(
        collection(db, "Friends"),
        where("userId1", "in", [friend.userId1, friend.userId2]),
        where("userId2", "in", [friend.userId1, friend.userId2])
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, "Friends", docSnap.id));
      });

      alert("تم إزالة الصديق!");
      setFriends(friends.filter(f => f.userId1 !== friend.userId1 && f.userId2 !== friend.userId2));
    } catch (error) {
      console.error("خطأ أثناء إزالة الصديق: ", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">إدارة طلبات الصداقة</h2>

      {/* Send friend request */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="أدخل اسم المستخدم لإرسال طلب صداقة"
          value={friendUsername}
          onChange={(e) => setFriendUsername(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button onClick={sendFriendRequest} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          {loading ? "جاري الإرسال..." : "إرسال طلب صداقة"}
        </button>
      </div>

      {/* Incoming friend requests */}
      <h3 className="text-lg font-bold mt-6">طلبات الصداقة الواردة</h3>
      {requests.length === 0 ? (
        <p>لا يوجد طلبات صداقة جديدة.</p>
      ) : (
        requests.map((request) => (
          <div key={request.id} className="flex justify-between items-center border p-2 my-2 rounded">
            <p>طلب صداقة من {request.senderId}</p>
            <div>
              <button onClick={() => acceptFriendRequest(request)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                قبول
              </button>
              <button onClick={() => rejectFriendRequest(request.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                رفض
              </button>
            </div>
          </div>
        ))
      )}

      {/* Existing friends */}
      <h3 className="text-lg font-bold mt-6">الأصدقاء الحاليين</h3>
      {friends.length === 0 ? (
        <p>لا يوجد أصدقاء حاليين.</p>
      ) : (
        friends.map((friend) => (
          <div key={friend.userId1 + friend.userId2} className="flex justify-between items-center border p-2 my-2 rounded">
            <p>صديق: {friend.userId1 === currentUser?.uid ? friend.userId2 : friend.userId1}</p>
            <button onClick={() => removeFriend(friend)} className="bg-red-500 text-white px-3 py-1 rounded">
              إزالة
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendSystem;
