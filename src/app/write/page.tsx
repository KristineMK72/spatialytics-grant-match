import ProposalBuilder from '@/components/ProposalBuilder';

export const metadata = {
  title: 'Grant Writer | Spatialytics Grant Match',
  description:
    'Guided grant proposal builder for Greater Minnesota nonprofits — structure need, goals, activities, budget, and evaluation.',
};

export default function WritePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-cyan-400 text-sm font-medium uppercase tracking-wide mb-2">
          Grant Writer
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Build a proposal, section by section
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Answer guided prompts. Get a structured draft you can copy into a
          foundation portal, DEED application, or Word doc. Built for small
          teams in Greater Minnesota — not consultants.
        </p>
      </div>
      <ProposalBuilder />
    </div>
  );
}
