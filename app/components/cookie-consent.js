'use client';

import { useCallback, useEffect, useState } from 'react';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import Link from 'next/link';

const STORAGE_KEY = 'jotaedra-cookie-consent';
const OPEN_EVENT = 'jotaedra:open-cookie-consent';
const GA_ID = 'G-9K841MNERH';
const ADSENSE_CLIENT = 'ca-pub-9956672685720320';

function readConsent() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.analytics !== 'boolean' ||
      typeof parsed?.ads !== 'boolean'
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [consent, setConsent] = useState(null);
  const [prefs, setPrefs] = useState({ analytics: false, ads: false });
  const [open, setOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    if (saved) {
      setConsent(saved);
      setPrefs(saved);
    } else {
      setOpen(true);
    }
    setReady(true);

    const onOpen = () => {
      const current = readConsent();
      setPrefs(
        current
          ? { analytics: current.analytics, ads: current.ads }
          : { analytics: false, ads: false }
      );
      setShowOptions(true);
      setOpen(true);
    };

    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;
      const next = readConsent();
      setConsent(next);
      if (next) setPrefs(next);
    };

    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const save = useCallback(
    (next) => {
      const previous = consent;
      const stored = {
        analytics: Boolean(next.analytics),
        ads: Boolean(next.ads),
        version: 1,
        updatedAt: new Date().toISOString(),
      };

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      } catch {
        // Private mode / storage disabled: still apply the choice this visit.
      }

      setConsent(stored);
      setPrefs(stored);
      setOpen(false);

      // A loaded third-party script cannot be unloaded reliably. Reload once
      // when the user revokes a permission so the next page runs without it.
      const revoked =
        previous &&
        ((previous.analytics && !stored.analytics) ||
          (previous.ads && !stored.ads));
      if (revoked) window.location.reload();
    },
    [consent]
  );

  if (!ready) return null;

  return (
    <>
      {consent?.analytics && <GoogleAnalytics gaId={GA_ID} />}
      {consent?.ads && (
        <Script
          id="adsense"
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      )}

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-[100] p-2 sm:p-3">
          <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-title"
            aria-describedby="cookie-desc"
            className="mx-auto w-full max-w-2xl rounded-xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
          >
            <h2 id="cookie-title" className="sr-only">
              Tu privacidad
            </h2>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p
                id="cookie-desc"
                className="text-xs leading-snug text-slate-600 dark:text-slate-300"
              >
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  Cookies.
                </span>{' '}
                Técnicas siempre activas; analítica y publicidad solo con permiso.{' '}
                <Link
                  href="/politica-de-privacidad#cookies"
                  className="font-semibold text-indigo-600 underline underline-offset-2 dark:text-sky-400"
                >
                  Más info
                </Link>
                .
              </p>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => save({ analytics: false, ads: false })}
                  className="inline-flex min-h-[32px] items-center justify-center rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => setShowOptions((value) => !value)}
                  aria-expanded={showOptions}
                  className="inline-flex min-h-[32px] items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20"
                >
                  Configurar
                </button>
                <button
                  type="button"
                  onClick={() => save({ analytics: true, ads: true })}
                  className="inline-flex min-h-[32px] items-center justify-center rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
                >
                  Aceptar
                </button>
              </div>
            </div>

            {showOptions && (
              <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-2 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={prefs.analytics}
                      onChange={(event) =>
                        setPrefs((current) => ({
                          ...current,
                          analytics: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-indigo-600"
                    />
                    Analítica
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={prefs.ads}
                      onChange={(event) =>
                        setPrefs((current) => ({
                          ...current,
                          ads: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-indigo-600"
                    />
                    Publicidad
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => save(prefs)}
                  className="inline-flex min-h-[32px] items-center justify-center rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:self-auto"
                >
                  Guardar selección
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
