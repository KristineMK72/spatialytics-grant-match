export default function PipelinePage() {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Pipeline</h1>
      <p className="text-slate-400 text-sm leading-relaxed">
        Saved grants and application status will live here once Supabase auth and
        the <code className="text-cyan-400">grant_pipelines</code> table are wired up.
        For now, use <strong className="text-white">Save</strong> on the Discover
        page (local only).
      </p>
      <a
        href="/"
        className="inline-flex px-4 py-2 rounded-full bg-cyan-500 text-slate-950 text-sm font-semibold"
      >
        Back to Discover
      </a>
    </div>
  );
}
