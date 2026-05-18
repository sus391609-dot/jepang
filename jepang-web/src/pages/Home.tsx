import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  NotebookPen,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { TOTAL_WORDS, VOCAB_SECTIONS } from "../data/vocab";

export default function Home() {
  const { memorized, history } = useApp();
  const memCount = Object.keys(memorized).length;
  const pct = TOTAL_WORDS > 0 ? Math.round((memCount / TOTAL_WORDS) * 100) : 0;
  const lastRuns = history.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="jp-card relative overflow-hidden rounded-3xl p-8 md:p-12">
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
            <Sparkles size={14} /> 日本語 Learning Hub
          </div>
          <h1 className="text-jp text-4xl font-bold leading-tight md:text-5xl">
            Belajar Bahasa Jepang
            <br />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              dengan cara yang menyenangkan
            </span>
          </h1>
          <p className="max-w-2xl text-neutral-400 md:text-lg">
            Hafalkan {TOTAL_WORDS.toLocaleString("id-ID")} kosakata, latih ingatan dengan tes
            pilihan ganda &amp; mengetik, dan susun kalimat dalam 5 tingkat kesulitan.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/kosakata"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
            >
              <BookOpen size={16} /> Mulai Belajar
            </Link>
            <Link
              to="/tes"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-neutral-100 transition hover:bg-white/5"
            >
              <GraduationCap size={16} /> Latih dengan Tes
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Target size={20} />}
          label="Kata dihafal"
          value={memCount.toLocaleString("id-ID")}
          sub={`dari ${TOTAL_WORDS.toLocaleString("id-ID")} kata`}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Progres hafalan"
          value={`${pct}%`}
          sub="berdasarkan kartu yang ditandai"
          accent
        />
        <StatCard
          icon={<GraduationCap size={20} />}
          label="Tes diselesaikan"
          value={history.length.toLocaleString("id-ID")}
          sub={history.length > 0 ? "lihat riwayat lengkap" : "belum ada tes"}
        />
      </section>

      {/* Categories */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Kategori Kosakata</h2>
          <Link
            to="/kosakata"
            className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
          >
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VOCAB_SECTIONS.map((s) => (
            <Link
              key={s.id}
              to={`/kosakata/${s.id}/1`}
              className="jp-card jp-card-hover rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl">{s.emoji}</div>
                  <h3 className="mt-2 text-base font-semibold text-neutral-100">
                    {s.label}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    {s.totalWords} kata &middot; {s.pages.length} halaman
                  </p>
                </div>
                <ArrowRight size={16} className="text-neutral-500" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent tests */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Tes Terakhir</h2>
          <Link
            to="/statistik"
            className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
          >
            Statistik lengkap <ArrowRight size={14} />
          </Link>
        </div>
        {lastRuns.length === 0 ? (
          <div className="jp-card rounded-2xl p-6 text-sm text-neutral-400">
            Belum ada tes yang dikerjakan. Mulai dari halaman{" "}
            <Link to="/tes" className="text-white underline-offset-4 hover:underline">
              Tes
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {lastRuns.map((r) => {
              const pct = Math.round((r.correct / r.total) * 100);
              const label =
                r.kind === "mc"
                  ? "Pilihan Ganda"
                  : r.kind === "typing"
                  ? "Mengetik"
                  : `Susun Kalimat L${r.level}`;
              return (
                <div key={r.id} className="jp-card rounded-2xl p-5">
                  <div className="text-xs text-neutral-500">
                    {new Date(r.finishedAt).toLocaleString("id-ID")}
                  </div>
                  <div className="mt-1 text-base font-semibold text-neutral-100">
                    {label}
                  </div>
                  <div className="mt-3 text-3xl font-bold">{pct}%</div>
                  <div className="text-xs text-neutral-400">
                    {r.correct}/{r.total} benar &middot; rata-rata {Math.round(r.avgAnswerMs / 1000)}d
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Notes shortcut */}
      <section className="jp-card flex flex-col items-start justify-between gap-3 rounded-2xl p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/5 p-3 text-neutral-200">
            <NotebookPen size={20} />
          </div>
          <div>
            <p className="text-base font-semibold">Catatan harian</p>
            <p className="text-sm text-neutral-400">
              Catat progres dan target belajarmu agar tidak lupa.
            </p>
          </div>
        </div>
        <Link
          to="/catatan"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/5"
        >
          Buka catatan <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="jp-card rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">{label}</p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            accent ? "bg-white text-neutral-900" : "bg-white/5 text-neutral-200"
          }`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      <p className="mt-1 text-xs text-neutral-500">{sub}</p>
    </div>
  );
}
