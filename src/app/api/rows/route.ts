import { getRows } from "@/lib/rows";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Number(searchParams.get("count")) || 10;
  const offset = Number(searchParams.get("offset")) || 0;

  try {
    return Response.json(await getRows(count, offset));
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: e instanceof Error ? e.message : "Failed to load rows" },
      { status: 500 },
    );
  }
}
