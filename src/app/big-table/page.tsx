import BigTable from "./table";
import TablePagination from "./pagination";
import { Suspense } from "react";

export default async function BigTablePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return (
    <main>
      <h1>Big table</h1>
      <Suspense fallback={<p>Loading rows...</p>}>
        <BigTable searchParams={searchParams} />
        <TablePagination />
      </Suspense>
    </main>
  );
}
