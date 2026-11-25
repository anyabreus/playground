"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { debounce } from "@/lib/debounce";
import RowFilterControls from "@/components/row-filter-controls";

export default function TableFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") ?? "";
  const searchCompany = searchParams.get("company") ?? "";

  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchQuery);
  const [company, setCompany] = useState(searchCompany);

  const applyFilter = useCallback(
    (name: "query" | "status" | "company", value: string) => {
      const params = new URLSearchParams(window.location.search);
      if (value) params.set(name, value);
      else params.delete(name);
      params.delete("offset");
      startTransition(() => router.push(`/big-table?${params.toString()}`));
    },
    [router, startTransition],
  );

  const debouncedFilters = useMemo(
    () => ({
      query: debounce((value: string) => applyFilter("query", value), 300),
      company: debounce((value: string) => applyFilter("company", value), 300),
    }),
    [applyFilter],
  );

  useEffect(
    () => () => {
      debouncedFilters.query.cancel();
      debouncedFilters.company.cancel();
    },
    [debouncedFilters],
  );

  function updateFilter(name: "query" | "status" | "company", value: string) {
    if (name === "status") {
      applyFilter(name, value);
    } else {
      if (name === "query") setQuery(value);
      else setCompany(value);
      debouncedFilters[name](value);
    }
  }

  return (
    <RowFilterControls
      query={query}
      status={searchParams.get("status") ?? ""}
      company={company}
      isPending={isPending}
      onQueryChange={(value) => updateFilter("query", value)}
      onStatusChange={(value) => updateFilter("status", value)}
      onCompanyChange={(value) => updateFilter("company", value)}
    />
  );
}
