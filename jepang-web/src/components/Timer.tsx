import { useEffect, useRef, useState } from "react";

interface Props {
  duration: number; // seconds
  questionKey: string | number;
  onExpire: () => void;
}

export default function Timer({ duration, questionKey, onExpire }: Props) {
  const [remaining, setRemaining] = useState(duration);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemaining(duration);
    const start = Date.now();
    const id = window.setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const left = Math.max(0, duration - elapsed);
      setRemaining(left);
      if (left <= 0) {
        window.clearInterval(id);
        onExpireRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [duration, questionKey]);

  const pct = Math.max(0, Math.min(100, (remaining / duration) * 100));
  const danger = remaining < duration * 0.25;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-400">Sisa waktu</span>
        <span className={danger ? "font-mono text-rose-400" : "font-mono text-neutral-300"}>
          {remaining.toFixed(1)}d
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-[width] duration-100 ${
            danger
              ? "bg-rose-400"
              : "bg-gradient-to-r from-neutral-200 to-neutral-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
