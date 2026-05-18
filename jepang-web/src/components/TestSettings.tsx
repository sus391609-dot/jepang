import { Clock, Hash, Type } from "lucide-react";

export type Direction = "kanji-to-arti" | "arti-to-kanji";

interface Props {
  count: number;
  setCount: (n: number) => void;
  timePerQ: number;
  setTimePerQ: (n: number) => void;
  direction?: Direction;
  setDirection?: (d: Direction) => void;
  maxCount: number;
}

const COUNT_OPTIONS = [10, 20, 30, 50];

export default function TestSettings({
  count,
  setCount,
  timePerQ,
  setTimePerQ,
  direction,
  setDirection,
  maxCount,
}: Props) {
  return (
    <div className="jp-card grid grid-cols-1 gap-4 rounded-2xl p-5 md:grid-cols-3">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
          <Hash size={14} /> Jumlah soal
        </div>
        <div className="flex flex-wrap gap-2">
          {COUNT_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setCount(opt)}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                count === opt
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/10 text-neutral-300 hover:bg-white/5"
              }`}
            >
              {opt}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCount(maxCount)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              count === maxCount && maxCount > 0
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/10 text-neutral-300 hover:bg-white/5"
            }`}
          >
            Semua ({maxCount})
          </button>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
          <Clock size={14} /> Waktu per soal
        </div>
        <div className="flex flex-wrap gap-2">
          {[10, 15, 20, 30, 60].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTimePerQ(s)}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                timePerQ === s
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/10 text-neutral-300 hover:bg-white/5"
              }`}
            >
              {s}d
            </button>
          ))}
        </div>
      </div>

      {direction && setDirection && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
            <Type size={14} /> Arah soal
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setDirection("kanji-to-arti")}
              className={`rounded-lg border px-3 py-2 text-left text-sm ${
                direction === "kanji-to-arti"
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/10 text-neutral-300 hover:bg-white/5"
              }`}
            >
              Kanji → Arti
            </button>
            <button
              type="button"
              onClick={() => setDirection("arti-to-kanji")}
              className={`rounded-lg border px-3 py-2 text-left text-sm ${
                direction === "arti-to-kanji"
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/10 text-neutral-300 hover:bg-white/5"
              }`}
            >
              Arti → Kanji
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
