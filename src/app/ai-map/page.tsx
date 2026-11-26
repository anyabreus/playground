import Link from "next/link";
import AiMapChat from "./chat-map";

export default function AiMapPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <header className="mx-auto mb-5 flex max-w-[1600px] items-center justify-between">
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Playground
          </Link>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            AI map assistant
          </h1>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
          AI SDK · Leaflet
        </span>
      </header>
      <AiMapChat />
    </main>
  );
}
