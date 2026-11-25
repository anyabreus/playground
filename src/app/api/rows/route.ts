import { getRows } from "@/lib/rows";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Number(searchParams.get("count")) || 10;
  const offset = Number(searchParams.get("offset")) || 0;
  const query = searchParams.get("query") || undefined;
  const status = searchParams.get("status") || undefined;
  const company = searchParams.get("company") || undefined;

  try {
    return Response.json(
      await getRows(count, offset, { query, status, company }),
    );
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: e instanceof Error ? e.message : "Failed to load rows" },
      { status: 500 },
    );
  }
}
