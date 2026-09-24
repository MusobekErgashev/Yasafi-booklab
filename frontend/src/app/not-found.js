import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col fixed top-0 left-0 right-0 bottom-0 bg-white text-center items-center justify-center h-screen">
      <h2 className="text-9xl font-bold">404</h2>
      <p className="text-6xl font-bold">Page Not Found</p>
      <p className="text-2xl my-4">Could not find requested resource</p>
      <Link href="/" className="text-blue-500 underline">
        Return Home
      </Link>
    </div>
  );
}