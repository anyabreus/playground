import { Row } from "@/types/table";

export default function RowsTable({ rows }: { rows: Row[] }) {
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  return rows.length === 0 ? (
    <p>No rows found.</p>
  ) : (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={String(row.id ?? index)}>
            {columns.map((column) => (
              <td key={column}>
                {typeof row[column] === "object" && row[column] !== null
                  ? JSON.stringify(row[column])
                  : String(row[column] ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
