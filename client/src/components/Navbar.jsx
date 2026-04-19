import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition ${
    isActive ? "bg-orange-500 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-xl font-bold text-white">
          ConstructoCalc <span className="text-orange-400">AI</span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" className={navClass}>
            Saved Projects
          </NavLink>
          <NavLink to="/chat" className={navClass}>
            AI Chat
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-orange-400/50 px-4 py-2 text-sm text-orange-200 transition hover:bg-orange-500 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="rounded-full px-4 py-2 text-sm text-slate-300 hover:bg-white/10" to="/login">
                Login
              </Link>
              <Link
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
