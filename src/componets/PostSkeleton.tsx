

const PostSkeleton = () => {
  return (
    <div className="animate-pulse max-w-md w-full mx-auto p-4">
      <div className="flex items-center space-x-4 mb-4">
        {/* صورة المستخدم */}
        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
        <div className="flex-1">
          {/* اسم المستخدم */}
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          {/* التاريخ */}
          <div className="h-3 bg-gray-300 rounded w-1/6"></div>
        </div>
      </div>
      {/* محتوى المنشور */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      {/* صورة المنشور */}
      <div className="h-48 bg-gray-300 rounded-lg mt-4"></div>
    </div>
  );
};

export default PostSkeleton;
