import Link from 'next/link'; //

export default function NotFound() {
  return (
    <div className="text-center p-10">
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="text-gray-600 my-4">Could not find requested resource</p>
      <Link href="/" className="text-blue-500 underline">
        Return Home
      </Link>
    </div>
  );
}