import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../api/client";
import ComparisonPanel from "../components/ComparisonPanel";
import CostSummaryCard from "../components/CostSummaryCard";
import LoadingSpinner from "../components/LoadingSpinner";
import MaterialBreakdownTable from "../components/MaterialBreakdownTable";
import { useAuth } from "../context/AuthContext";
import { costPieData, formatCurrency, materialChartData } from "../utils/format";

const COLORS = ["#f97316", "#0f766e"];

const DashboardPage = () => {
  const { user } = useAuth();
  const [estimate, setEstimate] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const latest = sessionStorage.getItem("constructocalc_latest");
    const secondary = sessionStorage.getItem("constructocalc_compare");
    if (latest) setEstimate(JSON.parse(latest));
    if (secondary) setComparison(JSON.parse(secondary));
  }, []);

  useEffect(() => {
    if (!estimate) return;

    setLoadingAi(true);
    api
      .post("/ai/analyze", {
        plotSize: estimate.input.plotSize,
        floors: estimate.input.floors,
        city: estimate.input.city,
        quality: estimate.input.quality,
        totalCost: estimate.result.totalCost,
        materialBreakdown: estimate.result.quantities
      })
      .then((response) => setAiInsights(response.data))
      .finally(() => setLoadingAi(false));
  }, [estimate]);

  const handleSave = async () => {
    if (!user || !estimate) return;
    const response = await api.post("/project", {
      name: `${estimate.input.city} ${estimate.input.plotSize} sq ft project`,
      input: estimate.input,
      result: estimate.result,
      aiInsights
    });
    setSaveStatus(`Saved project ${response.data.name}`);
  };

  const handleDownloadPdf = async () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("ConstructoCalc AI Report", 14, 20);
    doc.setFontSize(11);
    doc.text(`City: ${estimate.input.city}`, 14, 32);
    doc.text(`Plot Size: ${estimate.input.plotSize} sq ft`, 14, 39);
    doc.text(`Floors: ${estimate.input.floors}`, 14, 46);
    doc.text(`Quality: ${estimate.input.quality}`, 14, 53);
    doc.text(`Total Cost: ${formatCurrency(estimate.result.totalCost)}`, 14, 60);

    autoTable(doc, {
      startY: 68,
      head: [["Material", "Quantity", "Rate", "Cost"]],
      body: [
        ["Cement", estimate.result.quantities.cement.quantity.toFixed(2), formatCurrency(estimate.result.quantities.cement.rate), formatCurrency(estimate.result.quantities.cement.cost)],
        ["Steel", estimate.result.quantities.steel.quantity.toFixed(2), formatCurrency(estimate.result.quantities.steel.rate), formatCurrency(estimate.result.quantities.steel.cost)],
        ["Sand", estimate.result.quantities.sand.quantity.toFixed(2), formatCurrency(estimate.result.quantities.sand.rate), formatCurrency(estimate.result.quantities.sand.cost)],
        ["Bricks", estimate.result.quantities.bricks.quantity.toFixed(2), formatCurrency(estimate.result.quantities.bricks.rate), formatCurrency(estimate.result.quantities.bricks.cost)]
      ]
    });

    const nextY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(14);
    doc.text("AI Explanation", 14, nextY);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(aiInsights?.explanation || "AI explanation not available.", 180), 14, nextY + 8);

    doc.setFontSize(14);
    doc.text("Optimization Suggestions", 14, nextY + 38);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize((aiInsights?.optimization || ["No suggestions available"]).map((item) => `- ${item}`).join("\n"), 180), 14, nextY + 46);

    doc.setFontSize(14);
    doc.text("Risk Analysis", 14, nextY + 76);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize((aiInsights?.risks || ["No risks available"]).map((item) => `- ${item}`).join("\n"), 180), 14, nextY + 84);
    doc.save("constructocalc-report.pdf");
  };

  if (!estimate) {
    return <LoadingSpinner label="No calculation found. Start from the home page." />;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <CostSummaryCard title="Total Cost" value={estimate.result.totalCost} />
        <CostSummaryCard title="Material Cost" value={estimate.result.materialCost} accent="teal" />
        <CostSummaryCard title="Labor Cost" value={estimate.result.laborCost} accent="slate" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Estimate overview</p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                {estimate.input.city} • {estimate.input.plotSize} sq ft • {estimate.input.floors} floors
              </h2>
              <p className="mt-2 text-slate-300">
                Built-up area: <span className="font-semibold text-white">{estimate.result.builtUpArea.toFixed(2)} sq ft</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {user && (
                <button onClick={handleSave} className="rounded-2xl border border-orange-400/50 px-4 py-3 text-orange-200 hover:bg-orange-500 hover:text-white">
                  Save Project
                </button>
              )}
              <button onClick={handleDownloadPdf} className="rounded-2xl bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-500">
                Export PDF
              </button>
            </div>
          </div>
          {saveStatus && <p className="mt-4 text-sm text-emerald-300">{saveStatus}</p>}
          <div className="mt-6">
            <MaterialBreakdownTable quantities={estimate.result.quantities} />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-bold text-white">AI Insights</h3>
          {loadingAi && <div className="mt-4"><LoadingSpinner label="Analyzing estimate..." /></div>}
          {aiInsights && (
            <div className="mt-4 space-y-4 text-sm text-slate-200">
              <div>
                <p className="font-semibold text-orange-300">Explanation</p>
                <p className="mt-2 leading-7">{aiInsights.explanation}</p>
              </div>
              <div>
                <p className="font-semibold text-orange-300">Optimization</p>
                <ul className="mt-2 space-y-2">
                  {aiInsights.optimization.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-orange-300">Risks</p>
                <ul className="mt-2 space-y-2">
                  {aiInsights.risks.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <ComparisonPanel primary={estimate} secondary={comparison} />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <h3 className="mb-4 text-xl font-bold text-white">Cost Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={costPieData(estimate.result)} innerRadius={60} outerRadius={100} dataKey="value">
                  {costPieData(estimate.result).map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <h3 className="mb-4 text-xl font-bold text-white">Material Usage</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialChartData(estimate.result.quantities)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Bar dataKey="quantity" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
