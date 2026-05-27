import { useMemo, useState } from "react";
import { CalendarDays, Plus, Trash2, Save, Pencil, X } from "lucide-react";
import { useApp, type NoteEntry } from "../contexts/AppContext";

function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export default function Notes() {
  const { notes, addNote, deleteNote, updateNote } = useApp();
  const [date, setDate] = useState<string>(today());
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>("");

  const filtered = useMemo(() => {
    if (!filterDate) return notes;
    return notes.filter((n) => n.date === filterDate);
  }, [notes, filterDate]);

  const reset = () => {
    setDate(today());
    setTitle("");
    setBody("");
    setEditingId(null);
  };

  const submit = () => {
    if (!title.trim() && !body.trim()) return;
    if (editingId) {
      updateNote(editingId, { date, title: title.trim(), body: body.trim() });
    } else {
      addNote({ date, title: title.trim(), body: body.trim() });
    }
    reset();
  };

  const startEdit = (n: NoteEntry) => {
    setEditingId(n.id);
    setDate(n.date);
    setTitle(n.title);
    setBody(n.body);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Catatan Harian</h1>
        <p className="mt-2 text-neutral-400">
          Catat progres dan target belajar setiap harinya. Tersimpan otomatis di
          peramban kamu.
        </p>
      </header>

      {/* Form */}
      <div className="jp-card rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            {editingId ? "Ubah catatan" : "Catatan baru"}
          </p>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
            >
              <X size={14} /> Batal
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr]">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
              Tanggal
            </label>
            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-950/60 py-2.5 pl-9 pr-3 text-sm text-neutral-100 outline-none focus:border-white/30"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
              Judul
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="contoh: Selesai halaman 1 kata kerja"
              className="w-full rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-white/30 placeholder:text-neutral-600"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
            Catatan
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="Tulis target dan refleksi belajarmu di sini..."
            className="scrollbar-thin w-full resize-y rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-white/30 placeholder:text-neutral-600"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
          >
            {editingId ? (
              <>
                <Save size={16} /> Simpan perubahan
              </>
            ) : (
              <>
                <Plus size={16} /> Tambah catatan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs uppercase tracking-wider text-neutral-500">
          Filter tanggal:
        </label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-white/30"
        />
        {filterDate && (
          <button
            type="button"
            onClick={() => setFilterDate("")}
            className="text-xs text-neutral-400 hover:text-white"
          >
            Hapus filter
          </button>
        )}
        <span className="ml-auto text-xs text-neutral-500">
          {filtered.length} catatan
        </span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="jp-card rounded-2xl p-8 text-center text-sm text-neutral-500">
            Belum ada catatan. Mulai dengan menulis satu di atas.
          </div>
        ) : (
          filtered.map((n) => (
            <article key={n.id} className="jp-card rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-neutral-500">
                    {new Date(n.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                    {" · "}
                    <span className="text-neutral-600">
                      {new Date(n.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {n.title && (
                    <h3 className="mt-1 text-base font-semibold text-neutral-100">
                      {n.title}
                    </h3>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(n)}
                    className="rounded-lg border border-white/10 p-2 text-neutral-300 hover:bg-white/5"
                    aria-label="Ubah"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNote(n.id)}
                    className="rounded-lg border border-rose-400/20 p-2 text-rose-300 hover:bg-rose-400/10"
                    aria-label="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {n.body && (
                <p className="mt-3 whitespace-pre-wrap text-sm text-neutral-300">
                  {n.body}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
