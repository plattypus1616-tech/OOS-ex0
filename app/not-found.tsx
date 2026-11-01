import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans">
      <div className="max-w-md w-full text-center space-y-4">
        <h2 className="text-4xl font-black font-mono">404</h2>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          The requested page could not be found.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-5 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
