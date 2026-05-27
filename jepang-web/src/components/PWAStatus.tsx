import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";
import { CheckCircle2, RefreshCw, X } from "lucide-react";

export default function PWAStatus() {
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState<((reload?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    const update = registerSW({
      onOfflineReady() {
        setOfflineReady(true);
        setTimeout(() => setOfflineReady(false), 4000);
      },
      onNeedRefresh() {
        setNeedRefresh(true);
      },
    });
    setUpdateSW(() => update);
  }, []);

  if (!offlineReady && !needRefresh) return null;

  return (
    <div
      className="fixed inset-x-3 top-3 z-50 mx-auto max-w-md rounded-2xl border border-white/10 bg-neutral-900/95 px-4 py-3 shadow-2xl backdrop-blur sm:inset-x-auto sm:right-4 sm:top-4"
      style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))" }}
      role="status"
    >
      {needRefresh ? (
        <div className="flex items-center gap-3">
          <RefreshCw size={18} className="shrink-0 text-neutral-300" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-neutral-100">Versi baru tersedia</p>
            <p className="mt-0.5 text-xs text-neutral-400">
              Muat ulang untuk mendapatkan pembaruan terbaru.
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateSW?.(true)}
            className="shrink-0 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-white"
          >
            Muat ulang
          </button>
          <button
            type="button"
            onClick={() => setNeedRefresh(false)}
            className="rounded-lg p-1 text-neutral-500 hover:bg-white/5 hover:text-neutral-200"
            aria-label="Tutup"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-neutral-100">Siap dipakai offline</p>
            <p className="mt-0.5 text-xs text-neutral-400">
              Aplikasi sudah tersimpan di perangkat Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
