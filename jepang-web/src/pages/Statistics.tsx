import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CheckCircle2,
  Eraser,
  Target,
  Timer as TimerIcon,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { TOTAL_WORDS, VOCAB_SECTIONS } from "../data/vocab";

const COLORS = ["#e5e5e5", "#a3a3a3", "#737373", "#525252", "#404040"];

export default function Statistics() {
  const { memorized, history, clearHistory, jlptRuns } = useApp();
  const memCount = Object.keys(memorized).length;
  const pct = TOTAL_WORDS > 0 ? Math.round((memCount / TOTAL_WORDS) * 100) : 0;

  const [filter, setFilter] = useState<
    | "all"
    | "mc"
    | "typing"
    | "sentence"
    | "konjugasi"
    | "grammar"
    | "choukai"
    | "dokkai"
    | "jlpt"
  >("all");
  const filteredHistory = useMemo(
    () => (filter === "all" ? history : history.filter((h) => h.kind === filter)),
    [history, filter]
  );

  // Per-section memorized
  const perSection = useMemo(() => {
    return VOCAB_SECTIONS.map((s) => {
      let mem = 0;
      s.pages.forEach((p, pi) => {
        p.items.forEach((_, ii) => {
          if (memorized[`${s.id}-${pi}-${ii}`]) mem++;
        });
      });
      return {
        label: s.label.replace(/^[^\p{L}\p{N}]+/u, ""),
        total: s.totalWords,
        memorized: mem,
        pct: s.totalWords > 0 ? Math.round((mem / s.totalWords) * 100) : 0,
      };
    });
  }, [memorized]);

  // Average accuracy & speed
  const overall = useMemo(() => {
    if (filteredHistory.length === 0) {
      return { totalRuns: 0, accuracy: 0, avgSec: 0, totalCorrect: 0, totalAnswered: 0 };
    }
    let totalCorrect = 0;
    let totalAnswered = 0;
    let totalSec = 0;
    let totalCount = 0;
    for (const r of filteredHistory) {
      totalCorrect += r.correct;
      totalAnswered += r.total;
      totalSec += r.avgAnswerMs * r.total;
      totalCount += r.total;
    }
    return {
      totalRuns: filteredHistory.length,
      accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
      avgSec: totalCount > 0 ? totalSec / totalCount / 1000 : 0,
      totalCorrect,
      totalAnswered,
    };
  }, [filteredHistory]);

  // Accuracy line chart (last 20 runs, oldest first)
  const lineData = useMemo(() => {
    const recent = filteredHistory.slice(0, 20).reverse();
    return recent.map((r, i) => ({
      idx: i + 1,
      label: new Date(r.finishedAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      accuracy: Math.round((r.correct / r.total) * 100),
      speed: Math.max(
        0,
        Math.min(
          100,
          Math.round((1 - r.avgAnswerMs / (r.timePerQuestionSec * 1000)) * 100)
        )
      ),
    }));
  }, [filteredHistory]);

  const pieData = [
    { name: "Hafal", value: memCount },
    { name: "Belum", value: Math.max(0, TOTAL_WORDS - memCount) },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Statistik</h1>
        <p className="mt-2 text-neutral-400">
          Pantau progres hafalan, akurasi, dan kecepatan kamu.
        </p>
      </header>

      {/* Top stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Target size={18} />}
          label="Hafal"
          value={memCount.toLocaleString("id-ID")}
          sub={`dari ${TOTAL_WORDS.toLocaleString("id-ID")} kata`}
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Progres"
          value={`${pct}%`}
          sub="berdasarkan kartu yang ditandai"
          accent
        />
        <StatCard
          icon={<CheckCircle2 size={18} />}
          label="Akurasi rata-rata"
          value={`${overall.accuracy}%`}
          sub={`${overall.totalCorrect}/${overall.totalAnswered} benar`}
        />
        <StatCard
          icon={<TimerIcon size={18} />}
          label="Kecepatan rata-rata"
          value={`${overall.avgSec.toFixed(1)}d`}
          sub="per soal di seluruh tes"
        />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="jp-card rounded-2xl p-4 sm:p-5 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Tren akurasi &amp; kecepatan
          </h2>
          {lineData.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-500">
              Belum ada tes yang dikerjakan.
            </p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="label" stroke="#737373" fontSize={11} />
                  <YAxis stroke="#737373" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #262626",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    name="Akurasi (%)"
                    stroke="#e5e5e5"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="speed"
                    name="Kecepatan (%)"
                    stroke="#737373"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="jp-card rounded-2xl p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Hafalan keseluruhan
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #262626",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-neutral-300">
            {memCount} / {TOTAL_WORDS} kata
          </div>
        </div>
      </section>

      {/* Section progress bar */}
      <section className="jp-card rounded-2xl p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Hafalan per kategori
        </h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perSection} layout="vertical" margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis type="number" stroke="#737373" fontSize={11} />
              <YAxis
                dataKey="label"
                type="category"
                stroke="#737373"
                fontSize={10}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="memorized" name="Hafal" fill="#e5e5e5" radius={[0, 4, 4, 0]} />
              <Bar dataKey="total" name="Total" fill="#262626" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Simulasi JLPT */}
      <section className="jp-card rounded-2xl p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Simulasi JLPT N4
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Riwayat percobaan + tren total skor (0-180) dan skor per seksi.
            </p>
          </div>
          <span className="rounded-md border border-white/10 px-2 py-0.5 text-xs text-neutral-300">
            {jlptRuns.length} percobaan
          </span>
        </div>

        {jlptRuns.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-500">
            Belum ada percobaan simulasi JLPT.
          </p>
        ) : (
          <>
            <div className="mb-5 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={jlptRuns
                    .slice(0, 12)
                    .reverse()
                    .map((r, i) => {
                      const goi = r.sections.find((s) => s.id === "goi");
                      const bd = r.sections.find(
                        (s) => s.id === "bunpou-dokkai"
                      );
                      const ch = r.sections.find((s) => s.id === "choukai");
                      return {
                        idx: i + 1,
                        label: new Date(r.finishedAt).toLocaleDateString(
                          "id-ID",
                          { day: "2-digit", month: "short" }
                        ),
                        total: r.totalScore,
                        goi: goi?.score ?? 0,
                        bunpouDokkai: bd?.score ?? 0,
                        choukai: ch?.score ?? 0,
                      };
                    })}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="label" stroke="#737373" fontSize={11} />
                  <YAxis stroke="#737373" fontSize={11} domain={[0, 180]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #262626",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total /180"
                    stroke="#e5e5e5"
                    strokeWidth={2}
                    dot
                  />
                  <Line
                    type="monotone"
                    dataKey="goi"
                    name="Goi /60"
                    stroke="#a3a3a3"
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="bunpouDokkai"
                    name="Bunpou+Dokkai /60"
                    stroke="#737373"
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="choukai"
                    name="Choukai /60"
                    stroke="#525252"
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-neutral-500">
                    <th className="py-2 pr-3">Tanggal</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Total</th>
                    <th className="py-2 pr-3">Goi</th>
                    <th className="py-2 pr-3">Bunpou+Dokkai</th>
                    <th className="py-2 pr-3">Choukai</th>
                  </tr>
                </thead>
                <tbody>
                  {jlptRuns.slice(0, 12).map((r) => {
                    const goi = r.sections.find((s) => s.id === "goi");
                    const bd = r.sections.find(
                      (s) => s.id === "bunpou-dokkai"
                    );
                    const ch = r.sections.find((s) => s.id === "choukai");
                    return (
                      <tr
                        key={r.id}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className="py-3 pr-3 text-neutral-300">
                          {new Date(r.finishedAt).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 pr-3">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-xs ${
                              r.passed
                                ? "border-emerald-400/40 text-emerald-200"
                                : "border-rose-400/40 text-rose-200"
                            }`}
                          >
                            {r.passed ? "LULUS" : "TIDAK"}
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-neutral-100">
                          {r.totalScore}/180
                        </td>
                        <td className="py-3 pr-3 text-neutral-300">
                          {goi?.score ?? "-"}/60
                        </td>
                        <td className="py-3 pr-3 text-neutral-300">
                          {bd?.score ?? "-"}/60
                        </td>
                        <td className="py-3 pr-3 text-neutral-300">
                          {ch?.score ?? "-"}/60
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* History list */}
      <section className="jp-card rounded-2xl p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Riwayat tes
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {([
              ["all", "Semua"],
              ["mc", "Pilihan Ganda"],
              ["typing", "Mengetik"],
              ["sentence", "Susun Kalimat"],
              ["konjugasi", "Konjugasi"],
              ["grammar", "Tata Bahasa"],
              ["choukai", "Choukai"],
              ["dokkai", "Dokkai"],
              ["jlpt", "Simulasi JLPT"],
            ] as const).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                className={`rounded-lg border px-3 py-1.5 text-xs ${
                  filter === k
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-neutral-300 hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-400/10"
            >
              <Eraser size={12} /> Bersihkan
            </button>
          </div>
        </div>
        {filteredHistory.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-500">
            Belum ada riwayat tes.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-neutral-500">
                  <th className="py-2 pr-3">Tanggal</th>
                  <th className="py-2 pr-3">Jenis</th>
                  <th className="py-2 pr-3">Skor</th>
                  <th className="py-2 pr-3">Akurasi</th>
                  <th className="py-2 pr-3">Kecepatan</th>
                  <th className="py-2 pr-3">Halaman</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((r) => {
                  const acc = Math.round((r.correct / r.total) * 100);
                  const speed = Math.max(
                    0,
                    Math.min(
                      100,
                      Math.round((1 - r.avgAnswerMs / (r.timePerQuestionSec * 1000)) * 100)
                    )
                  );
                  return (
                    <tr key={r.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-3 text-neutral-300">
                        {new Date(r.finishedAt).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 pr-3">
                        <span className="rounded-md border border-white/10 px-2 py-0.5 text-xs text-neutral-200">
                          {r.kind === "mc"
                            ? "Pilihan Ganda"
                            : r.kind === "typing"
                            ? "Mengetik"
                            : r.kind === "konjugasi"
                            ? "Konjugasi"
                            : r.kind === "grammar"
                            ? "Tata Bahasa"
                            : r.kind === "choukai"
                            ? "Choukai"
                            : r.kind === "dokkai"
                            ? "Dokkai"
                            : r.kind === "jlpt"
                            ? `Simulasi JLPT (${r.variant})`
                            : `Susun L${r.level}`}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-neutral-100">
                        {r.correct}/{r.total}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={
                            acc >= 80
                              ? "text-emerald-300"
                              : acc >= 50
                              ? "text-amber-300"
                              : "text-rose-300"
                          }
                        >
                          {acc}%
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-neutral-300">
                        {speed}% &middot; {(r.avgAnswerMs / 1000).toFixed(1)}d
                      </td>
                      <td className="py-3 pr-3 text-neutral-400">
                        {r.pages.length} halaman
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
    <div className="jp-card rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-neutral-500">{label}</p>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            accent ? "bg-white text-neutral-900" : "bg-white/5 text-neutral-200"
          }`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <p className="mt-1 text-xs text-neutral-500">{sub}</p>
    </div>
  );
}
