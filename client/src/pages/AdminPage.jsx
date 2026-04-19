import { useEffect, useState } from "react";
import api from "../api/client";

const AdminPage = () => {
  const [form, setForm] = useState({
    cement_per_bag: 430,
    steel_per_kg: 62,
    sand_per_ton: 1800,
    brick_per_unit: 8.5,
    labor_percentage: 0.35
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/rates").then((response) => {
      if (response.data.materialRates) {
        setForm(response.data.materialRates);
      }
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: Number(value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post("/admin/rates", form);
    setMessage("Material rates updated successfully.");
  };

  return (
    <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Admin controls</p>
      <h1 className="mt-2 text-4xl font-bold text-white">Update Material Rates</h1>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          ["cement_per_bag", "Cement per bag"],
          ["steel_per_kg", "Steel per kg"],
          ["sand_per_ton", "Sand per ton"],
          ["brick_per_unit", "Brick per unit"],
          ["labor_percentage", "Labor percentage"]
        ].map(([key, label]) => (
          <label key={key} className="space-y-2 text-sm text-slate-300">
            <span>{label}</span>
            <input
              name={key}
              type="number"
              step="0.01"
              value={form[key]}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            />
          </label>
        ))}
        <button className="rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-400 sm:col-span-2">
          Save New Rates
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-emerald-300">{message}</p>}
    </div>
  );
};

export default AdminPage;
