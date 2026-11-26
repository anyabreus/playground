import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import type { MapTools } from "@/types/map";

const nominatimResultSchema = z.object({
  place_id: z.number(),
  display_name: z.string(),
  lat: z.string(),
  lon: z.string(),
});

export async function POST(request: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      {
        error: "Set GOOGLE_GENERATIVE_AI_API_KEY to use the AI map chat.",
      },
      { status: 503 },
    );
  }

  const { messages }: { messages: UIMessage[] } = await request.json();

  const searchLocations = tool({
    description:
      "Search OpenStreetMap for a place or address and return its coordinates. Use this whenever the user asks to find, locate, or show a place on the map. Do not invent coordinates.",
    inputSchema: z.object({
      query: z.string().min(2).max(120).describe("Place name or address"),
    }),
    execute: async ({ query }) => {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("q", query);
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("limit", "5");

      const response = await fetch(url, {
        headers: {
          "User-Agent": "playground-ai-map/1.0",
          "Accept-Language": "en",
        },
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        throw new Error(`Location search failed (HTTP ${response.status}).`);
      }

      const results = z
        .array(nominatimResultSchema)
        .parse(await response.json());
      const locations = results.flatMap(
        ({ place_id, display_name, lat, lon }) => {
          const latitude = Number(lat);
          const longitude = Number(lon);

          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
          ) {
            return [];
          }

          return [
            { id: place_id, name: display_name, lat: latitude, lon: longitude },
          ];
        },
      );

      return {
        query,
        locations,
      } satisfies MapTools["searchLocations"]["output"];
    },
  });

  const result = streamText({
    model: google("gemini-3.8-flash"),
    system:
      "You are a concise, friendly map assistant. Use the searchLocations tool whenever the user asks to find, locate, or show a place. Never guess coordinates. If no results are found, ask for a more specific place.",
    messages: await convertToModelMessages(messages),
    tools: { searchLocations },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      tools: { searchLocations },
      originalMessages: messages,
    }),
  });
}
