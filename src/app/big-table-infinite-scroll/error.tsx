"use client";

type BigTableErrorProps = {
  error: Error;
  reset: () => void;
};

export default function BigTableError({ error, reset }: BigTableErrorProps) {
  return (
    <main
      role="alert"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center"
    >
      <h2 className="text-xl font-semibold">Unable to load the table</h2>
      <p className="text-sm text-gray-600">
        {error.message || "Something went wrong while loading this page"}.
        Please try again.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </main>
  );
}
