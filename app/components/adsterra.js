'use client';

/**
 * Generic Adsterra inline ad (iframe format).
 *
 * Adsterra's `invoke.js` reads a global `atOptions` object and injects the ad
 * where the script runs. The classic pitfall: multiple placements on the same
 * page (e.g. this 160x600 skyscraper + the 300x250 banner) all write to the
 * SAME `window.atOptions` global, and the async `invoke.js` scripts race each
 * other. One ad ends up reading another ad's config and renders in the wrong
 * place (or not at all).
 *
 * To make each placement independent we isolate every ad inside its own
 * same-origin iframe via `srcdoc`. That iframe has its own `window`/`document`,
 * so `atOptions` (and Adsterra's other globals like `atAsyncContainers`) are
 * scoped per placement and can never collide. The parent URL is inherited as
 * the referrer, so Adsterra still sees a real page view.
 *
 * Usage:
 *   <AdsterraAd
 *     variant="posts-160x600"
 *     adKey="fa7e455ec598064d870403def8d5d90f"
 *     invokeUrl="https://www.highperformanceformat.com/fa7e455ec598064d870403def8d5d90f/invoke.js"
 *     width={160}
 *     height={600}
 *   />
 */
import { useState, useEffect, useRef } from 'react';

export default function AdsterraAd({
  adKey,
  format = 'iframe',
  width = 300,
  height = 250,
  invokeUrl,
  showLabel = true,
  lazy = true,
  onStatusChange,
}) {
  const [shouldRender, setShouldRender] = useState(!lazy);
  const [isEmpty, setIsEmpty] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  // Stabilize callback identity: parent inline arrows would otherwise
  // restart the 8s empty-detection clock on every render.
  const statusRef = useRef(onStatusChange);
  statusRef.current = onStatusChange;

  useEffect(() => {
    if (!lazy) return;

    let observer;
    let idleHandle;
    let timer;

    const loadAd = () => {
      setShouldRender(true);
    };

    if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
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
      observer.observe(containerRef.current);
    } else {
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(loadAd, { timeout: 2500 });
      } else {
        timer = setTimeout(loadAd, 1200);
      }
    }

    return () => {
      if (observer) observer.disconnect();
      if (idleHandle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle);
      if (timer) clearTimeout(timer);
    };
  }, [lazy]);

  // Adsterra has no-fill responses (e.g. 160x600 often returns empty
  // watch.js). Without detection the slot stays a 160x600 white box.
  // Poll the iframe DOM for a real creative; collapse if none appears.
  // NOTE: deps intentionally exclude onStatusChange (kept in statusRef)
  // so parent re-renders don't restart the give-up clock.
  useEffect(() => {
    if (!shouldRender || isEmpty) return;

    let disposed = false;
    const timers = [];
    const getFrame = () => iframeRef.current;

    const hasCreative = () => {
      try {
        const frame = getFrame();
        if (!frame) return false;
        const doc = frame.contentDocument;
        if (!doc || !doc.body) return false;
        // Filled slots inject an inner iframe/img/link/video/canvas.
        if (doc.querySelector('iframe, img, a[href], video, canvas, object, embed')) return true;
        // Fallback: non-script visible content.
        const text = (doc.body.innerText || '').trim();
        if (text.length > 0) return true;
        const meaningful = [...doc.body.children].filter(
          (el) => !['SCRIPT', 'STYLE', 'LINK', 'META', 'TITLE'].includes(el.tagName)
        );
        return meaningful.some((el) => {
          if (['IFRAME', 'IMG', 'VIDEO', 'CANVAS', 'A', 'OBJECT'].includes(el.tagName)) return true;
          return (el.innerHTML || '').trim().length > 0 && el.getBoundingClientRect().height > 10;
        });
      } catch (e) {
        return false;
      }
    };

    const check = (giveUp = false) => {
      if (disposed) return;
      if (hasCreative()) {
        if (statusRef.current) statusRef.current('loaded');
        return;
      }
      if (giveUp) {
        setIsEmpty(true);
        if (statusRef.current) statusRef.current('empty');
      }
    };

    const frame = getFrame();
    const onLoad = () => check(false);
    if (frame) frame.addEventListener('load', onLoad);
    timers.push(setTimeout(() => check(false), 2500));
    timers.push(setTimeout(() => check(false), 5000));
    // Give slow creatives ~8s before collapsing.
    timers.push(setTimeout(() => check(true), 8000));

    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
      if (frame) frame.removeEventListener('load', onLoad);
    };
  }, [shouldRender, isEmpty]);

  // Collapse entirely when Adsterra returns no fill — no label, no white box.
  if (isEmpty) return null;

  const scriptSrc =
    invokeUrl ||
    `https://www.highperformanceformat.com/${adKey}/invoke.js`;

  const srcDoc = `<!doctype html><html><head></head><body style="margin:0;padding:0"><script>window.atOptions={key:'${adKey}',format:'${format}',height:${height},width:${width},params:{}};</script><script src="${scriptSrc}"></script></body></html>`;

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center">
      {showLabel && (
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-2 select-none">
          Publicidad
        </span>
      )}
      <div className="max-w-full overflow-hidden" style={{ width, height }}>
        {shouldRender ? (
          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            // Sandbox blocks the ad creative from navigating the top page
            // (window.top.location hijack / automatic redirect / popunder).
            // - allow-scripts: ad can render itself inside the iframe
            // - allow-same-origin: REQUIRED — Adsterra's invoke.js reads
            //   document.cookie / localStorage on load. Without it the iframe
            //   gets an opaque origin, the read throws an uncaught
            //   SecurityError and the slot stays blank white + unclickable.
            // - allow-popups + allow-popups-to-escape-sandbox: legit ad clicks
            //   still open in a new tab
            // - deliberately NO allow-top-navigation: iframe can never redirect
            //   jotaedra.com itself, with or without user click
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ width, height, border: 0, display: 'block' }}
            scrolling="no"
            frameBorder="0"
            loading="lazy"
            title="Publicidad"
          />
        ) : (
          <div style={{ width, height }} className="bg-transparent" />
        )}
      </div>
    </div>
  );
}
