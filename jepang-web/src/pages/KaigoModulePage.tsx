import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, GraduationCap, Keyboard } from "lucide-react";
import { getKaigoModule } from "../data/kaigo";

export default function KaigoModulePage() {
  const { moduleId = "" } = useParams<{ moduleId: string }>();
  const mod = getKaigoModule(moduleId);

  if (!mod) {
    return (
      <div className="space-y-4">
        <Link
          to="/kaigo"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Semua modul Kaigo
        </Link>
        <p className="text-neutral-400">Modul Kaigo tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/kaigo"
        className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={14} /> Semua modul Kaigo
      </Link>

      <header className="jp-card flex flex-col gap-3 rounded-2xl p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span aria-hidden>{mod.emoji}</span>
            <span>{mod.label}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {mod.totalWords} kosakata · {mod.sections.length} kategori
          </h1>
          <p className="mt-1 text-sm text-neutral-400">{mod.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/kaigo/${mod.id}/tes/pilihan-ganda`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-neutral-100 hover:bg-white/5"
          >
            <GraduationCap size={14} /> Tes Pilihan Ganda
          </Link>
          <Link
            to={`/kaigo/${mod.id}/tes/mengetik`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-neutral-100 hover:bg-white/5"
          >
            <Keyboard size={14} /> Tes Mengetik
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mod.sections.map((s, i) => (
          <Link
            key={s.id}
            to={`/kaigo/${mod.id}/${s.id}/1`}
            className="jp-card jp-card-hover flex flex-col gap-2 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-neutral-500">
              <span>Kategori {i + 1}</span>
              <span aria-hidden className="text-2xl">
                {s.emoji}
              </span>
            </div>
            <div className="text-lg font-semibold text-neutral-100">{s.label}</div>
            <div className="text-xs text-neutral-400">
              {s.totalWords} kosakata · {s.pages.length} halaman
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-neutral-300">
              <BookOpen size={14} /> Lihat kosakata
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
