'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Adsterra Native Banner (sandboxed iframe placement).
 *
 * Unlike the old version that injected `invoke.js` directly into the main
 * document via `next/script`, the ad now runs isolated inside its own
 * `srcdoc` iframe with `sandbox="allow-scripts allow-popups ..."`.
 * Third-party ad JS running in the top window can call
 * `window.top.location` and force an automatic redirect / popunder without
 * any click — isolating it prevents the whole-site hijack while legit ad
 * clicks still open in a new tab.
 *
 * Usage:
 *   <AdsterraNative />
 */
const KEY = 'ea8ee4a51f55f54788c6620e8c4119a6';
const INVOKE_URL = `https://indefinitelynutmegbile.com/${KEY}/invoke.js`;

export default function AdsterraNative() {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
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
              idleHandle = window.requestIdleCallback(loadAd, { timeout: 3000 });
            } else {
              timer = setTimeout(loadAd, 1000);
            }
            observer.disconnect();
          }
        },
        { rootMargin: '300px' }
      );
      observer.observe(container);
    } else if ('requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(loadAd, { timeout: 3000 });
    } else {
      timer = setTimeout(loadAd, 1500);
    }

    return () => {
      if (observer) observer.disconnect();
      if (idleHandle && 'cancelIdleCallback' in window)
        window.cancelIdleCallback(idleHandle);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Native creatives are responsive: 4 items stack vertically on narrow
  // widths (≈1300px tall on mobile) and render as a grid on desktop.
  // A fixed iframe height (e.g. 250px) + scrolling="no" clips everything
  // below the first half-item. Auto-size the iframe to its content.
  useEffect(() => {
    if (!shouldRender) return;

    let disposed = false;
    const timers = [];
    let mutationObserver;
    let resizeObserver;
    let intervalId;
    const getFrame = () => iframeRef.current;

    const fit = () => {
      if (disposed) return;
      try {
        const frame = getFrame();
        if (!frame) return;
        const doc = frame.contentDocument;
        if (!doc) return;
        const body = doc.body;
        const el = doc.documentElement;
        if (!body || !el) return;
        const h = Math.max(
          body.scrollHeight || 0,
          el.scrollHeight || 0,
          body.offsetHeight || 0,
          el.offsetHeight || 0
        );
        // Clamp: ignore empty reads, cap runaway growth.
        if (h > 50 && h <= 3000) {
          const current = parseInt(frame.style.height, 10);
          if (current !== h) frame.style.height = `${h}px`;
        }
      } catch (e) {
        /* ignore until same-origin readable */
      }
    };

    const frame = getFrame();
    const onLoad = () => fit();
    if (frame) frame.addEventListener('load', onLoad);
    // Ad assets (images) arrive after invoke.js — re-fit several times.
    timers.push(setTimeout(fit, 500));
    timers.push(setTimeout(fit, 1500));
    timers.push(setTimeout(fit, 3000));
    timers.push(setTimeout(fit, 5000));
    intervalId = setInterval(fit, 1000);
    // Stop polling after 12s; observers + resize listener keep it fresh.
    timers.push(setTimeout(() => clearInterval(intervalId), 12000));

    const attachObservers = () => {
      try {
        const frame = getFrame();
        const doc = frame && frame.contentDocument;
        if (!doc || !doc.body) {
          timers.push(setTimeout(attachObservers, 500));
          return;
        }
        if (typeof MutationObserver !== 'undefined') {
          mutationObserver = new MutationObserver(fit);
          mutationObserver.observe(doc.body, {
            childList: true,
            subtree: true,
            attributes: true,
          });
        }
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(fit);
          resizeObserver.observe(doc.body);
        }
      } catch (e) {
        /* retry on next tick */
      }
    };
    attachObservers();

    const onResize = () => fit();
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
      clearInterval(intervalId);
      if (frame) frame.removeEventListener('load', onLoad);
      window.removeEventListener('resize', onResize);
      if (mutationObserver) mutationObserver.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [shouldRender]);

  const srcDoc = `<!doctype html><html><head><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><div id="container-${KEY}"></div><script async src="${INVOKE_URL}"></script></body></html>`;

  return (
    <div ref={containerRef} className="w-full flex justify-center my-8">
      {shouldRender ? (
        <iframe
          ref={iframeRef}
          srcDoc={srcDoc}
          // Block top-page navigation hijack; legit clicks still open new tab.
          // allow-same-origin is required: without it invoke.js throws on
          // document.cookie / localStorage and the slot stays blank.
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ width: '100%', maxWidth: 728, height: 400, border: 0, display: 'block', overflow: 'hidden' }}
          scrolling="no"
          frameBorder="0"
          loading="lazy"
          title="Publicidad"
        />
      ) : (
        <div className="w-full max-w-[728px] min-h-[120px] bg-transparent" />
      )}
    </div>
  );
}
