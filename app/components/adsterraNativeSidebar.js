'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Adsterra Native Banner for the post sidebar.
 *
 * This uses the SAME ad key as the in-article native banner
 * (`ea8ee4a51f55f54788c6620e8c4119a6`), and Adsterra's native invoke.js
 * always renders into `<div id="container-{key}">` found via getElementById.
 * Two same-key containers on the same page would collide, so we isolate this
 * placement inside its own same-origin `srcdoc` iframe: the invoke.js runs in
 * the iframe's document, finds its own container and can't interfere with the
 * in-article banner. The iframe then auto-sizes to its rendered content.
 */
const KEY = 'ea8ee4a51f55f54788c6620e8c4119a6';
const INVOKE_URL = `https://indefinitelynutmegbile.com/${KEY}/invoke.js`;

export default function AdsterraNativeSidebar({ width = 300 }) {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
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
              idleHandle = window.requestIdleCallback(loadAd, { timeout: 3000 });
            } else {
              timer = setTimeout(loadAd, 1000);
            }
            observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );
      observer.observe(containerRef.current);
    } else {
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(loadAd, { timeout: 3000 });
      } else {
        timer = setTimeout(loadAd, 1500);
      }
    }

    return () => {
      if (observer) observer.disconnect();
      if (idleHandle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle);
      if (timer) clearTimeout(timer);
    };
  }, []);

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
        const body = doc && doc.body;
        const el = doc && doc.documentElement;
        if (!body || !el) return;
        const h = Math.max(
          body.scrollHeight || 0,
          el.scrollHeight || 0,
          body.offsetHeight || 0,
          el.offsetHeight || 0
        );
        if (h > 50 && h <= 3000) {
          const current = parseInt(frame.style.height, 10);
          if (current !== h) frame.style.height = `${h}px`;
        }
      } catch (e) {
        /* cross-origin read not possible; ignore */
      }
    };

    const frame = getFrame();
    const onLoad = () => fit();
    if (frame) frame.addEventListener('load', onLoad);
    timers.push(setTimeout(fit, 500));
    timers.push(setTimeout(fit, 1500));
    timers.push(setTimeout(fit, 3000));
    timers.push(setTimeout(fit, 5000));
    intervalId = setInterval(fit, 1000);
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

  const srcDoc = `<!doctype html><html><head><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><div id="container-${KEY}"></div><script async src="${INVOKE_URL}"><\/script></body></html>`;

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-2 select-none">
        Publicidad
      </span>
      {shouldRender ? (
        <iframe
          ref={iframeRef}
          srcDoc={srcDoc}
          // Block top-page navigation hijack; legit clicks still open new tab.
          // allow-same-origin is required: without it invoke.js throws on
          // document.cookie and the slot stays blank, and the parent can't
          // auto-size the frame (contentDocument is null cross-origin).
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ width, height: 250, border: 0, display: 'block' }}
          scrolling="no"
          frameBorder="0"
          loading="lazy"
          title="Publicidad"
        />
      ) : (
        <div style={{ width, height: 250 }} className="bg-transparent" />
      )}
    </div>
  );
}