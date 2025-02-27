import React from "react";

const FriendSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between border p-3 my-2 rounded shadow-md w-full max-w-md bg-white animate-pulse">
      {/* صورة المستخدم */}
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

      {/* اسم المستخدم */}
      <div className="w-32 h-4 bg-gray-300 rounded"></div>

      {/* الأزرار */}
      <div className="flex gap-2">
        <div className="w-16 h-8 bg-gray-300 rounded"></div>
        <div className="w-16 h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default FriendSkeleton;
