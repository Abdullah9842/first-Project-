import { Timestamp } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { IoIosArrowBack } from "react-icons/io";
import FriendSkeleton from "./FriendSkeleton";
import { auth, db } from "./firebase";

interface Users {
  userId: string;
  name: string;
  photoURL: string;
  username: string;
}

interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderPic: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
}

interface Friends {
  id: string;
  userId1: string;
  userId2: string;
  name: string;
  photoURL: string;
  friendshipDate: Timestamp;
}

const FriendSystem: React.FC = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friends[]>([]);
  const [friendUsername, setFriendUsername] = useState<string>("");
  const [friendsCount, setFriendsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const fetchRequests = async () => {
        setLoadingRequests(true);
        try {
          const q = query(
            collection(db, "FriendRequests"),
            where("receiverId", "==", user.uid),
            where("status", "==", "pending")
          );
          const querySnapshot = await getDocs(q);
          const requestList = await Promise.all(
            querySnapshot.docs.map(async (docSnap) => {
              const requestData = docSnap.data() as FriendRequest;
              const senderQuery = query(
                collection(db, "Users"),
                where("userId", "==", requestData.senderId)
              );
              const senderSnapshot = await getDocs(senderQuery);
              const senderData = senderSnapshot.docs[0]?.data() as Users;
              return {
                ...requestData,
                id: docSnap.id,
                senderName: senderData?.name || "مستخدم مجهول",
                senderPic: senderData?.photoURL || "default-avatar.png",
              };
            })
          );
          setRequests(requestList);
        } catch (error) {
          console.error("Error fetching requests:", error);
        } finally {
          setLoadingRequests(false);
        }
      };

      const fetchFriends = async () => {
        if (!user) return;
        setLoadingFriends(true);
        try {
          const q1 = query(
            collection(db, "Friends"),
            where("userId1", "==", user.uid)
          );
          const q2 = query(
            collection(db, "Friends"),
            where("userId2", "==", user.uid)
          );

          const [querySnapshot1, querySnapshot2] = await Promise.all([
            getDocs(q1),
            getDocs(q2),
          ]);

          const friendList = await Promise.all([
            ...querySnapshot1.docs.map(async (docSnap) => {
              const friendData = docSnap.data() as Friends;
              const friendId =
                friendData.userId1 === user.uid
                  ? friendData.userId2
                  : friendData.userId1;
              const friendQuery = query(
                collection(db, "Users"),
                where("userId", "==", friendId)
              );
              const friendSnapshot = await getDocs(friendQuery);
              const friendInfo = friendSnapshot.docs[0]?.data() as Users;
              return {
                id: docSnap.id,
                userId1: friendData.userId1,
                userId2: friendData.userId2,
                name: friendInfo?.name || "مستخدم مجهول",
                photoURL: friendInfo?.photoURL || "default-avatar.png",
                friendshipDate: friendData.friendshipDate,
              };
            }),
            ...querySnapshot2.docs.map(async (docSnap) => {
              const friendData = docSnap.data() as Friends;
              const friendId =
                friendData.userId1 === user.uid
                  ? friendData.userId2
                  : friendData.userId1;
              const friendQuery = query(
                collection(db, "Users"),
                where("userId", "==", friendId)
              );
              const friendSnapshot = await getDocs(friendQuery);
              const friendInfo = friendSnapshot.docs[0]?.data() as Users;
              return {
                id: docSnap.id,
                userId1: friendData.userId1,
                userId2: friendData.userId2,
                name: friendInfo?.name || "مستخدم مجهول",
                photoURL: friendInfo?.photoURL || "default-avatar.png",
                friendshipDate: friendData.friendshipDate,
              };
            }),
          ]);

          const uniqueFriends = Array.from(
            new Set(friendList.map((f) => f.id))
          ).map((id) => friendList.find((f) => f.id === id));

          setFriends(uniqueFriends as Friends[]);
          setFriendsCount(uniqueFriends.length);
        } catch (error) {
          console.error("Error fetching friends:", error);
        } finally {
          setLoadingFriends(false);
        }
      };

      fetchRequests();
      fetchFriends();
    });
    return () => unsubscribe();
  }, []);

  const sendFriendRequest = async () => {
    if (!auth.currentUser || !friendUsername) return;
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "Users"),
        where("username", "==", friendUsername)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("المستخدم غير موجود!");
        return;
      }

      const receiver = querySnapshot.docs[0].data() as Users;

      if (receiver.userId === auth.currentUser.uid) {
        alert("لا يمكنك إرسال طلب صداقة لنفسك!");
        return;
      }

      const requestQuery = query(
        collection(db, "FriendRequests"),
        where("senderId", "==", auth.currentUser.uid),
        where("receiverId", "==", receiver.userId)
      );
      const requestSnapshot = await getDocs(requestQuery);
      if (!requestSnapshot.empty) {
        alert("لقد أرسلت طلب صداقة مسبقًا!");
        return;
      }

      await addDoc(collection(db, "FriendRequests"), {
        senderId: auth.currentUser.uid,
        receiverId: receiver.userId,
        status: "pending",
      });

      alert("تم إرسال طلب الصداقة!");
      setFriendUsername("");
    } catch (error) {
      console.error("خطأ أثناء إرسال الطلب: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptFriendRequest = async (request: FriendRequest) => {
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "FriendRequests", request.id), {
        status: "accepted",
      });

      await addDoc(collection(db, "Friends"), {
        userId1: request.senderId,
        userId2: request.receiverId,
        friendshipDate: Timestamp.now(),
        status: "active",
      });

      setRequests((prev) => prev.filter((req) => req.id !== request.id));
      setFriendsCount((prev) => prev + 1);
    } catch (error) {
      console.error("خطأ في قبول طلب الصداقة:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "FriendRequests", requestId));
      alert("تم رفض طلب الصداقة!");
      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("خطأ أثناء رفض الطلب: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFriend = async (friend: Friends) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "Friends", friend.id));

      const requestQuery = query(
        collection(db, "FriendRequests"),
        where("senderId", "in", [auth.currentUser?.uid, friend.userId1]),
        where("receiverId", "in", [auth.currentUser?.uid, friend.userId2])
      );
      const requestSnapshot = await getDocs(requestQuery);
      requestSnapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, "FriendRequests", docSnap.id));
      });

      alert("تم إزالة الصديق!");
      setFriends(friends.filter((f) => f.id !== friend.id));
      setFriendsCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("خطأ أثناء إزالة الصديق: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="flex items-center mb-4">
        <button
          onClick={handleClose}
          className="bg-gray-800 text-white px-4 py-2 rounded mb-4 hover:bg-gray-600"
        >
          <IoIosArrowBack />
        </button>
      </div>

      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="أدخل اسم المستخدم لإرسال طلب صداقة"
          value={friendUsername}
          onChange={(e) => setFriendUsername(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button
          onClick={sendFriendRequest}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full hover:bg-blue-600"
        >
          {isLoading ? "جاري الإرسال..." : "إرسال طلب صداقة"}
        </button>
      </div>

      <h3 className="text-lg font-bold mt-6">عدد الأصدقاء: {friendsCount}</h3>

      <h3 className="text-lg font-bold mt-6">طلبات الصداقة الواردة</h3>
      {loadingRequests ? (
        <>
          <FriendSkeleton />
          <FriendSkeleton />
        </>
      ) : requests.length === 0 ? (
        <p>لا يوجد طلبات صداقة جديدة.</p>
      ) : (
        requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between border p-3 my-2 rounded shadow-md w-full max-w-md"
          >
            <img
              src={request.senderPic}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <p>{request.senderName}</p>
            <div>
              <button
                onClick={() => acceptFriendRequest(request)}
                disabled={isLoading}
                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
              >
                قبول
              </button>
              <button
                onClick={() => rejectFriendRequest(request.id)}
                disabled={isLoading}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                رفض
              </button>
            </div>
          </div>
        ))
      )}

      <h3 className="text-lg font-bold mt-6">الأصدقاء الحاليين</h3>
      {loadingFriends ? (
        <>
          <FriendSkeleton />
          <FriendSkeleton />
          <FriendSkeleton />
        </>
      ) : friends.length === 0 ? (
        <p>لا يوجد أصدقاء حاليين.</p>
      ) : (
        friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between border p-3 my-2 rounded shadow-md w-full max-w-md"
          >
            <img
              src={friend.photoURL}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <p>{friend.name}</p>
            <button
              onClick={() => removeFriend(friend)}
              disabled={isLoading}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              إزالة
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendSystem;
