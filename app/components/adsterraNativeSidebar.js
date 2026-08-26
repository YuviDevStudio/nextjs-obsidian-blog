'use client';

import { useEffect, useRef } from 'react';

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

export default function AdsterraNativeSidebar() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;

    const fit = () => {
      try {
        const doc = frame.contentDocument;
        const body = doc && doc.body;
        if (!body) return;
        const h = body.scrollHeight;
        if (h > 0 && h !== parseInt(frame.style.height, 10)) {
          frame.style.height = `${h}px`;
        }
      } catch (e) {
        /* cross-origin read not possible; ignore */
      }
    };

    frame.addEventListener('load', fit);
    const poll = setInterval(fit, 500);
    const stop = setTimeout(() => clearInterval(poll), 15000);

    return () => {
      clearInterval(poll);
      clearTimeout(stop);
      frame.removeEventListener('load', fit);
    };
  }, []);

  const srcDoc = `<!doctype html><html><head></head><body style="margin:0;padding:0"><div id="container-${KEY}"></div><script async src="${INVOKE_URL}"><\/script></body></html>`;

  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-2 select-none">
        Publicidad
      </span>
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        style={{ width: 300, height: 250, border: 0, display: 'block' }}
        scrolling="no"
        frameBorder="0"
        loading="lazy"
        title="Publicidad"
      />
    </div>
  );
}