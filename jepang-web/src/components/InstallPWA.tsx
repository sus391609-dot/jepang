import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "jepang:pwa:installDismissedAt";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function wasRecentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const ts = Number.parseInt(raw, 10);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < DISMISS_TTL_MS;
}

export default function InstallPWA() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (wasRecentlyDismissed()) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    const onInstalled = () => {
      setShow(false);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!show || !deferred) return null;

  const handleInstall = async () => {
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "dismissed") {
        window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
      }
    } finally {
      setShow(false);
      setDeferred(null);
    }
  };

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  return (
    <div
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border border-white/10 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur sm:inset-x-auto sm:right-4 sm:bottom-4"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
      role="dialog"
      aria-label="Pasang aplikasi"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-500 text-neutral-900">
          <Download size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-neutral-100">Pasang 日本語 Hub</p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-400">
            Pasang aplikasi untuk akses cepat & bisa dipakai offline di HP / desktop Anda.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstall}
              className="rounded-lg bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-white"
            >
              Pasang
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-lg px-3 py-2 text-xs font-medium text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
            >
              Nanti saja
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-lg p-1 text-neutral-500 hover:bg-white/5 hover:text-neutral-200"
          aria-label="Tutup"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
