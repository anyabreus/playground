"use server";

import { Row, RowFilters } from "@/types/table";

const firstNames = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Jamie",
  "Avery",
  "Cameron",
  "Quinn",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Brown",
  "Garcia",
  "Miller",
  "Davis",
  "Wilson",
  "Moore",
  "Taylor",
  "Anderson",
];
const companies = [
  "Northstar",
  "Blue Oak",
  "Summit",
  "Brightside",
  "Pioneer",
  "Evergreen",
  "Atlas",
  "Redwood",
];
const statuses = ["Active", "Pending", "Inactive"];

export async function getRows(
  count: number,
  offset = 0,
  filters: RowFilters = {},
) {
  if (!Number.isInteger(count) || count < 1 || count > 100_000) {
    throw new Error("count must be an integer between 1 and 100000");
  }

  if (!Number.isInteger(offset) || offset < 0) {
    throw new Error("offset must be a non-negative integer");
  }

  await new Promise((r) => setTimeout(r, 500));

  const query = filters.query?.trim().toLowerCase();
  const status = filters.status?.trim();
  const company = filters.company?.trim();
  const hasFilters = Boolean(query || status || company);

  if (!hasFilters) {
    return Array.from({ length: count }, (_, index) => {
      const rowIndex = offset + index;
      const firstName = firstNames[rowIndex % firstNames.length];
      const lastName =
        lastNames[Math.floor(rowIndex / firstNames.length) % lastNames.length];

      return {
        id: rowIndex + 1,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${rowIndex + 1}@example.com`,
        company: companies[rowIndex % companies.length],
        status: statuses[rowIndex % statuses.length],
        amount: ((rowIndex * 137) % 100000) / 100,
      };
    });
  }

  const rows: Row[] = [];
  let matched = 0;

  for (let rowIndex = 0; rows.length < count && rowIndex < 100_000; rowIndex++) {
    const firstName = firstNames[rowIndex % firstNames.length];
    const lastName =
      lastNames[Math.floor(rowIndex / firstNames.length) % lastNames.length];
    const row: Row = {
      id: rowIndex + 1,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${rowIndex + 1}@example.com`,
      company: companies[rowIndex % companies.length],
      status: statuses[rowIndex % statuses.length],
      amount: ((rowIndex * 137) % 100000) / 100,
    };

    if (status && row.status !== status) continue;
    if (company && row.company !== company) continue;
    if (
      query &&
      !Object.values(row).some((value) =>
        String(value ?? "").toLowerCase().includes(query),
      )
    ) {
      continue;
    }

    if (matched >= offset) rows.push(row);
    matched++;
  }

  return rows;
}
