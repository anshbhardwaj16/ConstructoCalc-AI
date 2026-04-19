import { formatCurrency } from "../utils/format";

const MaterialBreakdownTable = ({ quantities }) => {
  const rows = [
    ["Cement", "bags", quantities?.cement],
    ["Steel", "kg", quantities?.steel],
    ["Sand", "tons", quantities?.sand],
    ["Bricks", "units", quantities?.bricks]
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/5 text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Material</th>
            <th className="px-4 py-3 text-left">Quantity</th>
            <th className="px-4 py-3 text-left">Rate</th>
            <th className="px-4 py-3 text-left">Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 text-slate-200">
          {rows.map(([label, unit, item]) => (
            <tr key={label}>
              <td className="px-4 py-3">{label}</td>
              <td className="px-4 py-3">{item?.quantity?.toFixed(2)} {unit}</td>
              <td className="px-4 py-3">{formatCurrency(item?.rate)}</td>
              <td className="px-4 py-3">{formatCurrency(item?.cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialBreakdownTable;
