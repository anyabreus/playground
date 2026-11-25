"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Row } from "@/types/table";
import RowsTable from "@/components/rows-table";
import { getRows } from "@/lib/rows";

const PAGE_SIZE = 50;

export default function InfiniteTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef(false);
  const offsetRef = useRef(0);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setIsLoading(true);

    try {
      const batch: Row[] = await getRows(PAGE_SIZE, offsetRef.current);

      offsetRef.current += batch.length;
      setRows((currentRows) => [...currentRows, ...batch]);
      setHasMore(batch.length === PAGE_SIZE);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [hasMore]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    const loadMoreTrigger = loadMoreTriggerRef.current;
    if (!loadMoreTrigger || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: "100px" },
    );
    observer.observe(loadMoreTrigger);

    return () => observer.disconnect();
  }, [hasMore, loadMore, rows.length]);

  return (
    <>
      <RowsTable rows={rows} />
      {isLoading ? (
        <p role="status" aria-live="polite" className="mt-4">
          Loading rows...
        </p>
      ) : !hasMore ? (
        <p className="mt-4">All rows loaded.</p>
      ) : null}
      <div ref={loadMoreTriggerRef} aria-hidden="true" />
    </>
  );
}
