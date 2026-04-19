import { formatCurrency } from "../utils/format";

const CostSummaryCard = ({ title, value, accent = "orange" }) => {
  const accents = {
    orange: "from-orange-500/20 to-orange-200/10 text-orange-100",
    teal: "from-teal-500/20 to-teal-200/10 text-teal-100",
    slate: "from-slate-500/20 to-slate-200/10 text-slate-100"
  };

  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${accents[accent]} p-6 shadow-soft`}>
      <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{title}</p>
      <p className="mt-3 text-3xl font-bold text-white">{formatCurrency(value)}</p>
    </div>
  );
};

export default CostSummaryCard;
