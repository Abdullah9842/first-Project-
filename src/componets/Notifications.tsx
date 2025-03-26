import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";
import defaultAvatar from "../assets/pngtree-cat-default-avatar-image_2246581.jpg";

interface Notification {
  id: string;
  type: "like";
  postId: string;
  postText: string;
  fromUserId: string;
  fromUserName: string;
  fromUserPhoto: string;
  timestamp: Timestamp;
  read: boolean;
}

interface NotificationsProps {
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        const notificationsQuery = query(
          collection(db, "notifications"),
          where("toUserId", "==", currentUser.uid),
          orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(
          notificationsQuery,
          (querySnapshot) => {
            const newNotifications = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Notification[];
            setNotifications(newNotifications);
            setLoading(false);
            setError(null);
          },
          (error) => {
            console.error("Error fetching notifications:", error);
            if (error.code === 'permission-denied') {
              setError(t("notifications.permissionDenied"));
            } else {
              setError(t("notifications.error"));
            }
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error in fetchNotifications:", error);
        setError(t("notifications.error"));
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchNotifications();
    }, 1000);

    return () => clearTimeout(timer);
  }, [t]);

  const formatTime = (timestamp: Timestamp) => {
    try {
      const now = new Date();
      const notificationDate = timestamp.toDate();
      const diffInMinutes = Math.floor(
        (now.getTime() - notificationDate.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return t("notifications.justNow");
      if (diffInMinutes < 60)
        return t("notifications.minutesAgo", { minutes: diffInMinutes });

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24)
        return t("notifications.hoursAgo", { hours: diffInHours });

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7)
        return t("notifications.daysAgo", { days: diffInDays });

      return notificationDate.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting time:", error);
      return t("notifications.justNow");
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 flex items-start justify-end pt-16 px-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-96 p-4">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-start justify-end pt-16 px-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{t("notifications.title")}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-gray-500 text-lg font-medium">
              {t("notifications.empty")}
            </p>
            <p className="text-gray-400 text-sm text-center mt-2">
              {t("notifications.emptyDescription")}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={notification.fromUserPhoto || defaultAvatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = defaultAvatar;
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {notification.fromUserName}
                      </span>{" "}
                      {t("notifications.likedPost")}
                    </p>
                    {notification.postText && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        "{notification.postText}"
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
