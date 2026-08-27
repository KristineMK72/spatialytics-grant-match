import GrantExplorer from '@/components/GrantExplorer';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-cyan-400 text-sm font-medium uppercase tracking-wide mb-2">
          Greater Minnesota
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Find grants by place, not just keywords
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Explore funding opportunities that match your service area and mission.
          Built for small nonprofits and community groups in the Brainerd Lakes
          area and across Greater Minnesota.
        </p>
      </div>
      <GrantExplorer />
    </div>
  );
}
