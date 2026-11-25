import { getRows } from "@/lib/rows";
import { Row } from "@/types/table";
import RowsTable from "@/components/rows-table";
import TablePagination from "./pagination";

export default async function BigTable({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { count, offset, query, status, company } = await searchParams;

  const pageSize = Number(count) || 10;
  const currentOffset = Number(offset) || 0;
  const rows: Row[] = await getRows(pageSize, currentOffset, {
    query,
    status,
    company,
  });

  return (
    <>
      <RowsTable rows={rows} />
      {rows.length > 0 && <TablePagination />}
    </>
  );
}
