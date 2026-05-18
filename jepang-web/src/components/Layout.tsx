import { type ReactNode, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Home,
  Menu,
  NotebookPen,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Beranda", icon: Home },
  { to: "/kosakata", label: "Kosakata", icon: BookOpen },
  { to: "/tes", label: "Tes", icon: GraduationCap },
  { to: "/statistik", label: "Statistik", icon: TrendingUp },
  { to: "/catatan", label: "Catatan Harian", icon: NotebookPen },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-bg min-h-screen text-neutral-100">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform jp-card border-r border-white/10 transition-transform duration-300 md:relative md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col p-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-500 text-neutral-900 shadow-lg">
                <Sparkles size={20} />
              </div>
              <div>
                <h1 className="text-jp text-lg font-bold tracking-tight">日本語</h1>
                <p className="text-xs text-neutral-400">Belajar Bahasa Jepang</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-gradient-to-r from-neutral-100/15 to-neutral-100/5 text-white shadow-inner"
                          : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl bg-gradient-to-br from-white/5 to-transparent p-4 text-xs text-neutral-400">
              <p className="text-jp mb-1 text-base font-semibold text-neutral-200">
                頑張って!
              </p>
              <p>Belajar sedikit setiap hari lebih baik daripada banyak sekaligus.</p>
            </div>
          </div>
        </aside>

        {/* Backdrop on mobile */}
        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main */}
        <main className="min-h-screen w-full min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-neutral-950/70 px-4 py-3 backdrop-blur md:hidden">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg p-2 text-neutral-300 hover:bg-white/5"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <p className="text-sm font-medium text-neutral-300">
              {NAV.find((n) => n.to === location.pathname)?.label ?? "Belajar Bahasa Jepang"}
            </p>
            <div className="w-9" />
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-10 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
