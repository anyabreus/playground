type RowFilterControlsProps = {
  query: string;
  status: string;
  company: string;
  isPending?: boolean;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
};

export default function RowFilterControls({
  query,
  status,
  company,
  isPending = false,
  onQueryChange,
  onStatusChange,
  onCompanyChange,
}: RowFilterControlsProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1">
        Search
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Name, email, company..."
          className="rounded border px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        Status
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>
      </label>
      <label className="flex flex-col gap-1">
        Company
        <input
          type="search"
          value={company}
          onChange={(event) => onCompanyChange(event.target.value)}
          placeholder="Company"
          className="rounded border px-3 py-2"
        />
      </label>
      {isPending && (
        <p role="status" aria-live="polite">
          Filtering...
        </p>
      )}
    </div>
  );
}
