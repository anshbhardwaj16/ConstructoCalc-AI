import { formatCurrency } from "../utils/format";

const ComparisonPanel = ({ primary, secondary }) => {
  if (!primary || !secondary) return null;

  const diff = primary.result.totalCost - secondary.result.totalCost;
  const better = diff <= 0 ? "Scenario A is more economical" : "Scenario B is more economical";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Scenario Comparison</p>
          <h3 className="mt-2 text-2xl font-bold text-white">{better}</h3>
        </div>
        <p className="text-lg font-semibold text-orange-300">
          Difference: {formatCurrency(Math.abs(diff))}
        </p>
      </div>
    </div>
  );
};

export default ComparisonPanel;
