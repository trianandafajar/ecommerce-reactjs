import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-6">
      <h1 className="text-6xl font-bold text-black mb-4">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <Link
        to="/"
        className="text-sm text-white bg-black px-4 py-2 rounded hover:bg-gray-800"
      >
        Go Back Home
      </Link>
    </div>
  );
}
