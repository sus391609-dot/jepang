import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, GraduationCap, HeartPulse, Keyboard } from "lucide-react";
import { KAIGO_MODULES, KAIGO_TOTAL_WORDS } from "../data/kaigo";

export default function Kaigo() {
  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
          <HeartPulse size={14} /> Modul Kaigo
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Bahasa Jepang Kaigo (介護)</h1>
        <p className="mt-2 max-w-2xl text-neutral-400">
          Kosakata khusus perawatan lansia. Diurutkan dari yang paling sering
          dipakai di lapangan: anggota tubuh, organ tubuh, kemudian aktivitas
          perawatan harian. Total{" "}
          <span className="font-semibold text-neutral-100">
            {KAIGO_TOTAL_WORDS}
          </span>{" "}
          kosakata.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {KAIGO_MODULES.map((mod) => (
          <article
            key={mod.id}
            className="jp-card jp-card-hover flex flex-col gap-5 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden>
                  {mod.emoji}
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{mod.label}</h2>
                  <p className="text-xs text-neutral-500">
                    {mod.totalWords} kosakata · {mod.sections.length} kategori
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-neutral-400">{mod.description}</p>

            <div className="flex flex-wrap gap-2 text-xs text-neutral-300">
              {mod.sections.slice(0, 6).map((s) => (
                <span
                  key={s.id}
                  className="rounded-full border border-white/10 px-2.5 py-1"
                >
                  {s.emoji} {s.label}
                </span>
              ))}
              {mod.sections.length > 6 && (
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-neutral-500">
                  +{mod.sections.length - 6} lainnya
                </span>
              )}
            </div>

            <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Link
                to={`/kaigo/${mod.id}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200"
              >
                <BookOpen size={14} /> Kosakata
              </Link>
              <Link
                to={`/kaigo/${mod.id}/tes/pilihan-ganda`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-neutral-100 hover:bg-white/5"
              >
                <GraduationCap size={14} /> Tes PG
              </Link>
              <Link
                to={`/kaigo/${mod.id}/tes/mengetik`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-neutral-100 hover:bg-white/5"
              >
                <Keyboard size={14} /> Mengetik
              </Link>
            </div>

            <Link
              to={`/kaigo/${mod.id}`}
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
            >
              Lihat semua kategori <ArrowRight size={14} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
