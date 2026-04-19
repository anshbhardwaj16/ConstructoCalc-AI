import { useEffect, useState } from "react";
import api from "../api/client";
import { formatCurrency } from "../utils/format";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then((response) => setProjects(response.data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Your saved estimates</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Saved Projects</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project._id} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{project.name}</h2>
                <p className="mt-2 text-sm text-slate-400">
                  {project.input.city} • {project.input.plotSize} sq ft • {project.input.floors} floors
                </p>
              </div>
              <span className="rounded-full bg-orange-400/10 px-3 py-2 text-xs font-semibold text-orange-300">
                {project.input.quality}
              </span>
            </div>
            <p className="mt-5 text-3xl font-bold text-white">{formatCurrency(project.result.totalCost)}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">{project.aiInsights?.explanation || "AI explanation not saved yet."}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
