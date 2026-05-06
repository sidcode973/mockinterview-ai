"use client";

import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="py-8 px-4 mx-auto max-w-7xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
          Error
        </h1>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
          {error?.message || "An error occurred"}
        </p>
        <div className="flex items-center justify-center gap-3 my-4">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-primary-900"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex border border-default-200 text-default-700 hover:bg-default-100 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}