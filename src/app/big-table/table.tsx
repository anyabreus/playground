import { getRows } from "@/lib/rows";
import { Row } from "@/types/table";
import RowsTable from "@/components/rows-table";

export default async function BigTable({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { count, offset } = await searchParams;

  const pageSize = Number(count) || 10;
  const currentOffset = Number(offset) || 0;
  const rows: Row[] = await getRows(pageSize, currentOffset);

  return <RowsTable rows={rows} />;
}
