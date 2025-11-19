import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center -mt-10 min-h-[calc(100vh-200px)] text-center">
      
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
          Campus Connect
        </h1>
        <p className="text-2xl font-semibold text-blue-600 mb-8">
          Your University's Lost & Found Hub
        </p>
        <p className="text-lg text-gray-600 mb-12">
          Lost something? Found something? We're here to help you reconnect with your items and fellow students. Log in to get started.
        </p>
      </div>

      {/* Call to Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6">
        <Link 
          href="/report-found"
          className="px-10 py-4 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
        >
          📝 Report a Found Item
        </Link>
        <Link 
          href="/report-lost"
          className="px-10 py-4 text-lg font-semibold text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
        >
          ✍️ Report a Lost Item
        </Link>
      </div>

      {/* Links to browse */}
      <div className="mt-20">
        <p className="text-gray-500">Or, browse what's already been reported:</p>
        <div className="flex gap-8 mt-4">
          <Link href="/items?type=FOUND" className="text-lg text-blue-600 font-medium hover:underline">
            🔍 View Found Items
          </Link>
          <Link href="/items?type=LOST" className="text-lg text-blue-600 font-medium hover:underline">
            🔎 View Lost Items
          </Link>
        </div>
      </div>
    </div>
  );
}
