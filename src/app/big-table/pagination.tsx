"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function TablePagination() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const pageSize = Number(searchParams.get("count")) || 10;
  const offset = Number(searchParams.get("offset")) || 0;
  const currentPage = Math.floor(offset / pageSize) + 1;
  const visiblePages = Array.from(
    { length: 5 },
    (_, index) => Math.max(1, currentPage - 2) + index,
  );

  function navigateToPage(pageNumber: number) {
    const offset = (pageNumber - 1) * pageSize;
    startTransition(() => {
      router.push(`/big-table?count=${pageSize}&offset=${offset}`);
    });
  }

  return (
    <>
      <nav aria-label="Table pages" className="mt-4 flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1 || isPending}
          onClick={() => navigateToPage(currentPage - 1)}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Previous
        </button>
        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            disabled={pageNumber === currentPage || isPending}
            aria-current={pageNumber === currentPage ? "page" : undefined}
            onClick={() => navigateToPage(pageNumber)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          disabled={isPending}
          onClick={() => navigateToPage(currentPage + 1)}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </nav>
      {isPending && (
        <p role="status" aria-live="polite" className="mt-2">
          Loading page...
        </p>
      )}
    </>
  );
}
