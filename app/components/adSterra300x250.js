'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Adsterra 300x250 inline ad (sandboxed iframe format).
 *
 * The ad runs isolated inside its own `srcdoc` iframe with a restrictive
 * `sandbox` (no `allow-top-navigation`). Third-party banner creatives can
 * otherwise call `window.top.location` and hijack the whole page with an
 * automatic redirect / popunder without any click — which is what was
 * happening on the site.
 *
 * Each placement passes a unique `variant` (e.g. "home", "posts") so React
 * remounts correctly when navigating between page types.
 */
const AD_KEY = '42723bf5162f297557501cd8d7ccc692';
const INVOKE_URL = `https://indefinitelynutmegbile.com/${AD_KEY}/invoke.js`;

export default function AdSterra300x250({ variant = 'home', lazy = true }) {
  const [shouldRender, setShouldRender] = useState(!lazy);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!lazy) return;
    const container = containerRef.current;
    if (!container) return;

    let observer;
    let idleHandle;
    let timer;

    const loadAd = () => setShouldRender(true);

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            if ('requestIdleCallback' in window) {
              idleHandle = window.requestIdleCallback(loadAd, { timeout: 2500 });
            } else {
              timer = setTimeout(loadAd, 800);
            }
            observer.disconnect();
          }
        },
        { rootMargin: '300px' }
      );
      observer.observe(container);
    } else if ('requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(loadAd, { timeout: 2500 });
    } else {
      timer = setTimeout(loadAd, 1200);
    }

    return () => {
      if (observer) observer.disconnect();
      if (idleHandle && 'cancelIdleCallback' in window)
        window.cancelIdleCallback(idleHandle);
      if (timer) clearTimeout(timer);
    };
  }, [lazy, variant]);

  const srcDoc = `<!doctype html><html><head></head><body style="margin:0;padding:0"><script>window.atOptions={key:'${AD_KEY}',format:'iframe',height:250,width:300,params:{}};</script><script src="${INVOKE_URL}"></script></body></html>`;

  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-2 select-none">
        Publicidad
      </span>
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] max-w-full overflow-hidden"
      >
        {shouldRender ? (
          <iframe
            key={variant}
            srcDoc={srcDoc}
            // Block top-page navigation hijack; legit clicks still open new tab.
            // allow-same-origin is required: without it Adsterra's invoke.js
            // throws on document.cookie and the slot stays blank/unclickable.
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ width: 300, height: 250, border: 0, display: 'block' }}
            scrolling="no"
            frameBorder="0"
            loading="lazy"
            title="Publicidad"
          />
        ) : (
          <div style={{ width: 300, height: 250 }} className="bg-transparent" />
        )}
      </div>
    </div>
  );
}
