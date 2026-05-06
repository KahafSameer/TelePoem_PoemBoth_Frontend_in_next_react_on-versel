import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-slate-50">
      {/* Decorative floating circles */}
      <div
        className="float-slow pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="float-medium pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="float-slow pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-amber-100/30 blur-2xl"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6">
        {/* Wordmark */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">📜</span>
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
            TelePoem
          </span>
          <span className="text-2xl" aria-hidden="true">📜</span>
        </div>
        <h1 className="text-center text-5xl font-bold tracking-tight text-indigo-900">
          TelePoem Interface
        </h1>
        <p className="mt-3 text-center text-lg text-slate-600">
          A poetry kiosk experience — choose where you&apos;d like to go.
        </p>

        {/* Entry cards */}
        <div className="mt-10 grid w-full gap-5 sm:grid-cols-2">
          {/* Kiosk card — amber accent */}
          <Link
            href="/client"
            className="group relative rounded-2xl border border-amber-200 bg-white p-7 shadow-sm ring-2 ring-amber-400/60 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl shadow-sm">
              🎭
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">TelePoem</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Public poetry browsing with booth, collection, poem, and audio flow.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-600 transition-colors group-hover:text-amber-700">
              Browse poetry
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          {/* Admin card — slate accent */}
          <Link
            href="/admin"
            className="group relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm ring-2 ring-slate-300 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl shadow-sm">
              ⚙️
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Manage booths, collections, poets, and poems.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors group-hover:text-slate-800">
              Open dashboard
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
