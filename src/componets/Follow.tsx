// import React, { useState, useEffect } from 'react';
// import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'; 
// import { db } from './firebase'; // Import the db from firebase.ts

// interface FollowProps {
//   currentUserId: string;
// }

// interface FollowedUser {
//   id: string;
//   followingId: string;
// }

// const Follow: React.FC<FollowProps> = ({ currentUserId }) => {
//   const [userIdToFollow, setUserIdToFollow] = useState<string>(''); // Input for following a user
//   const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]); // List of followed users
//   const [loading, setLoading] = useState<boolean>(false); // Loading state

//   // Fetch the list of users the current user is following
//   useEffect(() => {
//     const fetchFollowedUsers = async () => {
//       setLoading(true);
//       try {
//         const q = query(collection(db, 'followers'), where('userId', '==', currentUserId));
//         const snapshot = await getDocs(q);
//         const users = snapshot.docs.map((doc) => ({
//           id: doc.id, // Document ID (for unfollowing)
//           followingId: doc.data().followingId, // ID of the followed user
//         }));
//         setFollowedUsers(users);
//       } catch (error) {
//         console.error('Error fetching followed users: ', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFollowedUsers();
//   }, [currentUserId]); // Remove db from dependency array

//   // Handle following a user
//   const handleFollow = async () => {
//     if (!userIdToFollow) return;

//     try {
//       const followersCollection = collection(db, 'followers');
//       await addDoc(followersCollection, {
//         userId: currentUserId,
//         followingId: userIdToFollow,
//         timestamp: new Date(),
//       });
//       alert(`You are now following user with ID: ${userIdToFollow}`);
//       setUserIdToFollow(''); // Clear input
//       // Refresh the list of followed users
//       const snapshot = await getDocs(query(collection(db, 'followers'), where('userId', '==', currentUserId)));
//       const users = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         followingId: doc.data().followingId,
//       }));
//       setFollowedUsers(users);
//     } catch (error) {
//       console.error('Error following user: ', error);
//     }
//   };

//   // Handle unfollowing a user
//   const handleUnfollow = async (documentId: string) => {
//     try {
//       await deleteDoc(doc(db, 'followers', documentId));
//       alert('You have unfollowed the user.');
//       // Refresh the list of followed users
//       const updatedUsers = followedUsers.filter((user) => user.id !== documentId);
//       setFollowedUsers(updatedUsers);
//     } catch (error) {
//       console.error('Error unfollowing user: ', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Follow Users</h1>

//       {/* Input to follow a user */}
//       <div>
//         <input
//           type="text"
//           value={userIdToFollow}
//           onChange={(e) => setUserIdToFollow(e.target.value)}
//           placeholder="Enter user ID to follow"
//         />
//         <button onClick={handleFollow} disabled={loading}>
//           {loading ? 'Following...' : 'Follow'}
//         </button>
//       </div>

//       {/* Display list of followed users */}
//       <div>
//         <h3>Users you are following:</h3>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <ul>
//             {followedUsers.map((user) => (
//               <li key={user.id}>
//                 {user.followingId}
//                 <button onClick={() => handleUnfollow(user.id)}>Unfollow</button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Follow;
import React, { useState, useEffect } from "react";
import { db } from "./firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore";

// تعريف الخصائص التي يقبلها مكون Follow
interface FollowProps {
  currentUserId: string;
  targetUserId: string;
}

const Follow: React.FC<FollowProps> = ({ currentUserId, targetUserId }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isRequestSent, setIsRequestSent] = useState<boolean>(false);

  useEffect(() => {
    const checkIfFollowing = async () => {
      const docRef = doc(db, "followRequests", currentUserId + "_" + targetUserId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const requestData = docSnap.data();
        if (requestData.status === "accepted") {
          setIsFollowing(true);
        } else {
          setIsRequestSent(true);
        }
      }
    };
    checkIfFollowing();
  }, [currentUserId, targetUserId]);

  const handleFollowRequest = async () => {
    try {
      await setDoc(doc(db, "followRequests", currentUserId + "_" + targetUserId), {
        userId: currentUserId,
        targetUserId,
        status: "pending", // الطلب في حالة تعليق
      });
      setIsRequestSent(true);
    } catch (error) {
      console.error("Error sending follow request: ", error);
    }
  };

  const handleApproveFollow = async () => {
    try {
      const docRef = doc(db, "followRequests", currentUserId + "_" + targetUserId);
      await setDoc(docRef, { status: "accepted" }, { merge: true });
      setIsFollowing(true);
    } catch (error) {
      console.error("Error approving follow request: ", error);
    }
  };

  const handleRejectFollow = async () => {
    try {
      const docRef = doc(db, "followRequests", currentUserId + "_" + targetUserId);
      await setDoc(docRef, { status: "rejected" }, { merge: true });
      setIsRequestSent(false);
    } catch (error) {
      console.error("Error rejecting follow request: ", error);
    }
  };

  return (
    <div>
      {isFollowing ? (
        <p>You are following this user.</p>
      ) : isRequestSent ? (
        <div>
          <p>Follow request sent. Waiting for approval.</p>
          <button onClick={handleRejectFollow}>Reject</button>
        </div>
      ) : (
        <button onClick={handleFollowRequest}>Send Follow Request</button>
      )}
      {isRequestSent && (
        <div>
          <button onClick={handleApproveFollow}>Approve</button>
          <button onClick={handleRejectFollow}>Reject</button>
        </div>
      )}
    </div>
  );
};

export default Follow;
