const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;
