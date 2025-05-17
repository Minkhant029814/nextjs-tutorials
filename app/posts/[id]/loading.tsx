export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-4">
          <p className="text-lg text-gray-700">Loading post..... </p>
        </div>
      </div>
    </div>
  );
}
