interface PostProps {
  title: string;
  videoUrl: string;
  thumbnail: string;
}

export default function Post({ title, videoUrl, thumbnail }: PostProps) {
  return (
    <div className="max-w-md mx-auto bg-white border border-gray-300 rounded-lg shadow-sm my-5">
      {/* Video */}
      <video
        src={videoUrl}
        poster={thumbnail}
        controls
        className="w-full object-cover"
        style={{ maxHeight: '500px' }}
      />

      {/* Title */}
      <div className="p-3 border-t border-gray-200 text-gray-700 font-semibold">
        {title}
      </div>
    </div>
  );
}
