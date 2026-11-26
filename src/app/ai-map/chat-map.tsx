"use client";

import { SubmitEvent, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import type { MapMessage, MapTools } from "@/types/map";

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-96 items-center justify-center bg-slate-900 text-sm text-slate-400">
      Loading map…
    </div>
  ),
});

const suggestions = [
  "Find the Eiffel Tower",
  "Show me Kyoto",
  "Where is the Golden Gate Bridge?",
];
const noLocations: MapTools["searchLocations"]["output"]["locations"] = [];

export default function AiMapChat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat<MapMessage>({
    transport: new DefaultChatTransport({ api: "/api/ai-map" }),
  });
  const isBusy = status === "submitted" || status === "streaming";

  const locations = useMemo(
    () =>
      messages
        .flatMap((message) =>
          message.parts.flatMap((part) =>
            part.type === "tool-searchLocations" &&
            part.state === "output-available"
              ? [part.output.locations]
              : [],
          ),
        )
        .at(-1) ?? noLocations,
    [messages],
  );

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;

    setInput("");
    sendMessage({ text });
  }

  return (
    <section className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[minmax(340px,0.8fr)_minmax(0,1.2fr)]">
      <div className="flex min-h-[34rem] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 lg:h-[calc(100vh-8rem)]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="font-medium">Chat</h2>
          <p className="mt-1 text-sm text-slate-400">
            Ask about a place to find it on the map.
          </p>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">Try asking:</p>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={isBusy}
                  onClick={() => sendMessage({ text: suggestion })}
                  className="block w-full rounded-xl border border-slate-800 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-sky-500/60 hover:bg-slate-800 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-8 rounded-2xl rounded-br-sm bg-sky-500/15 px-4 py-3 text-sm text-sky-50"
                    : "mr-5 space-y-3 text-sm leading-6 text-slate-200"
                }
              >
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <p
                        key={`${message.id}-${index}`}
                        className="whitespace-pre-wrap"
                      >
                        {part.text}
                      </p>
                    );
                  }

                  if (part.type === "tool-searchLocations") {
                    if (part.state !== "output-available") {
                      return (
                        <p
                          key={`${message.id}-${index}`}
                          className="text-xs text-slate-400"
                        >
                          Searching OpenStreetMap…
                        </p>
                      );
                    }

                    return (
                      <p
                        key={`${message.id}-${index}`}
                        className="text-xs text-slate-400"
                      >
                        {part.output.locations.length
                          ? `Found ${part.output.locations.length} map result${part.output.locations.length === 1 ? "" : "s"} for “${part.output.query}”.`
                          : `No locations found for “${part.output.query}”.`}
                      </p>
                    );
                  }

                  return null;
                })}
              </div>
            ))
          )}
          {isBusy && (
            <p className="text-sm text-slate-400" role="status">
              Thinking…
            </p>
          )}
          {error && (
            <p className="rounded-lg border border-red-900/80 bg-red-950/50 px-3 py-2 text-sm text-red-200">
              {error.message}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-800 p-4">
          <label htmlFor="chat-prompt" className="sr-only">
            Message the map assistant
          </label>
          <div className="flex gap-2">
            <input
              id="chat-prompt"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Find a place…"
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isBusy}
              className="rounded-xl bg-sky-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Place searches use OpenStreetMap data.
          </p>
        </form>
      </div>

      <div className="relative h-[28rem] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 lg:h-[calc(100vh-8rem)]">
        <LeafletMap locations={locations} />
        <div className="pointer-events-none absolute left-4 top-4 z-[1000] rounded-lg border border-slate-200/70 bg-white/95 px-3 py-2 text-sm font-medium text-slate-800 shadow">
          {locations.length
            ? `${locations.length} result${locations.length === 1 ? "" : "s"}`
            : "Search for a place"}
        </div>
      </div>
    </section>
  );
}
