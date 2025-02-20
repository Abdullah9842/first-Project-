import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase"; // Make sure this is correctly imported from your firebase config
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

// Define User type based on your Firestore schema
interface User {
  id: string;
  username: string;
}

// Define FollowRequest type for handling follow requests
interface FollowRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
}

const FollowSystem: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = auth.currentUser;  // Ensure that auth is initialized

  // Search for users by username
  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    const q = query(collection(db, "Users"), where("username", "==", searchQuery));
    const querySnapshot = await getDocs(q);
    const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    setUsers(userList);
    setLoading(false);
  };

  // Send a follow request to another user
  const sendFollowRequest = async (receiverId: string) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, "FollowRequests"), {
        senderId: currentUser.uid,
        receiverId,
        status: "pending",
      });
      alert("تم إرسال الطلب!");
    } catch (error) {
      console.error("خطأ أثناء إرسال الطلب: ", error);
    }
  };

  // Fetch incoming follow requests
  useEffect(() => {
    if (!currentUser) return;
    const fetchRequests = async () => {
      const q = query(
        collection(db, "FollowRequests"),
        where("receiverId", "==", currentUser.uid),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      const requestList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FollowRequest));
      setRequests(requestList);
    };
    fetchRequests();
  }, [currentUser]);

  // Accept a follow request
  const acceptFollowRequest = async (request: FollowRequest) => {
    try {
      await updateDoc(doc(db, "FollowRequests", request.id), { status: "accepted" });
      await addDoc(collection(db, "Followers"), {
        followerId: request.senderId,
        followingId: request.receiverId,
      });
      alert("تم قبول الطلب!");
      setRequests(requests.filter(req => req.id !== request.id));
    } catch (error) {
      console.error("خطأ أثناء القبول: ", error);
    }
  };

  // Reject a follow request
  const rejectFollowRequest = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, "FollowRequests", requestId));
      alert("تم رفض الطلب!");
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error("خطأ أثناء الرفض: ", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">إدارة المتابعين</h2>

      {/* Search for users */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="ابحث عن يوزر..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          بحث
        </button>
      </div>

      {/* Display search results */}
      {loading ? (
        <p>جاري البحث...</p>
      ) : (
        users.map((user) => (
          <div key={user.id} className="flex justify-between items-center border p-2 my-2 rounded">
            <p>{user.username}</p>
            <button onClick={() => sendFollowRequest(user.id)} className="bg-green-500 text-white px-4 py-2 rounded">
              طلب متابعة
            </button>
          </div>
        ))
      )}

      {/* Incoming follow requests */}
      <h3 className="text-lg font-bold mt-6">طلبات المتابعة الواردة</h3>
      {requests.length === 0 ? (
        <p>لا يوجد طلبات متابعة جديدة.</p>
      ) : (
        requests.map((request) => (
          <div key={request.id} className="flex justify-between items-center border p-2 my-2 rounded">
            <p>طلب متابعة من {request.senderId}</p>
            <div>
              <button onClick={() => acceptFollowRequest(request)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                قبول
              </button>
              <button onClick={() => rejectFollowRequest(request.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                رفض
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FollowSystem;
