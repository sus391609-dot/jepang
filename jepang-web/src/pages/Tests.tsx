import { Link } from "react-router-dom";
import { GraduationCap, ListChecks, Keyboard, Shuffle, ArrowRight } from "lucide-react";

const TESTS = [
  {
    to: "/tes/pilihan-ganda",
    title: "Pilihan Ganda",
    desc: "Pilih arti yang benar dari kanji yang diberikan, atau sebaliknya. Tanpa romaji.",
    icon: ListChecks,
  },
  {
    to: "/tes/mengetik",
    title: "Mengetik",
    desc: "Ketik arti dari kanji, atau ketik romaji dari arti.",
    icon: Keyboard,
  },
  {
    to: "/tes/susun-kalimat",
    title: "Susun Kalimat",
    desc: "Susun pola kalimat dari arti ke kanji atau romaji. 5 level kesulitan.",
    icon: Shuffle,
  },
];

export default function Tests() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
          <GraduationCap size={14} /> Tes &amp; Latihan
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Pilih Jenis Tes</h1>
        <p className="text-neutral-400">
          Setiap tes bisa kamu sesuaikan: pilih halaman, jumlah soal, dan waktu per soal.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TESTS.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="jp-card jp-card-hover flex flex-col justify-between rounded-2xl p-6"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-neutral-900">
                  <Icon size={20} />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{t.title}</h2>
                <p className="mt-2 text-sm text-neutral-400">{t.desc}</p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1 text-sm text-neutral-300">
                Mulai <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
