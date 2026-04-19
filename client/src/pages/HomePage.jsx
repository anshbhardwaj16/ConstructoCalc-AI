import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";

const initialForm = {
  plotSize: 1200,
  floors: 2,
  quality: "Standard",
  city: "Bengaluru",
  customCity: "",
  customMultiplier: 1,
  materialPreference: "default",
  inflationPercent: 0
};

const HomePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/rates").then((response) => {
      setCities(response.data.cityMultipliers || []);
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/calculate", form);
      const previous = sessionStorage.getItem("constructocalc_latest");
      if (previous) {
        sessionStorage.setItem("constructocalc_compare", previous);
      }
      sessionStorage.setItem("constructocalc_latest", JSON.stringify(response.data));
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">
            India-focused AI construction estimator
          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-tight text-white sm:text-6xl">
            Estimate smarter, compare faster, plan safer.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            ConstructoCalc AI helps homeowners, contractors, and students estimate Indian house construction costs with live rate logic, visual dashboards, and Groq-powered insights.
          </p>
          <p className="mt-4 max-w-xl text-sm text-slate-400">
            Run a second estimate with different values and the dashboard will automatically compare it against your previous scenario.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Plot size (sq ft)</span>
                <input name="plotSize" type="number" value={form.plotSize} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Floors</span>
                <input name="floors" type="number" min="1" value={form.floors} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Construction quality</span>
                <select name="quality" value={form.quality} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none">
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Premium</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>City</span>
                <select name="city" value={form.city} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none">
                  {cities.map((city) => (
                    <option key={city._id} value={city.city_name}>
                      {city.city_name}
                    </option>
                  ))}
                  <option value="Custom">Custom city</option>
                </select>
              </label>
            </div>

            {form.city === "Custom" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Custom city name</span>
                  <input name="customCity" value={form.customCity} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Custom multiplier</span>
                  <input name="customMultiplier" type="number" step="0.01" value={form.customMultiplier} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
                </label>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Material preference</span>
                <select name="materialPreference" value={form.materialPreference} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none">
                  <option value="default">Balanced</option>
                  <option value="economy">Economy</option>
                  <option value="eco_friendly">Eco friendly</option>
                  <option value="durable">Durable</option>
                  <option value="premium_finish">Premium finish</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Inflation slider ({form.inflationPercent}%)</span>
                <input name="inflationPercent" type="range" min="0" max="15" value={form.inflationPercent} onChange={handleChange} className="w-full accent-orange-500" />
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-400"
            >
              {loading ? "Calculating..." : "Calculate Construction Cost"}
            </button>
            {loading && <LoadingSpinner label="Generating estimate..." />}
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
