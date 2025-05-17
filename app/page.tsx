export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to My Next.js App!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          This is my first Next.js project built from scratch with Tailwind CSS
        </p>
        <a
          href="/about"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}
