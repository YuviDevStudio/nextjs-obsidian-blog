'use client';

import { useEffect, useRef } from 'react';

/**
 * Adsterra 300x250 inline ad (iframe format).
 *
 * Adsterra's `invoke.js` reads a global `atOptions` object and then injects
 * an iframe replacement inline where the script is appended to the DOM.
 *
 * WHY NOT next/script: next/script hoists `<script>` tags into <head>/<body>
 * far from the intended insertion point, and `dangerouslySetInnerHTML` does
 * NOT execute <script> tags. Ad networks like Adsterra rely on the script
 * running exactly where you place it. So we append real <script> elements
 * imperatively via useEffect so the ad iframe renders inside this container.
 *
 * Each placement passes a unique `variant` (e.g. "home", "posts") so the
 * global `atOptions` set before each invoke.js load doesn't collide when the
 * homepage and an article page are both mounted in one session.
 */
export default function AdSterra300x250({ variant = 'home' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.querySelector('iframe')) return; // idempotent

    // 1) Set the global options that invoke.js will read.
    window.atOptions = {
      key: '42723bf5162f297557501cd8d7ccc692',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {},
    };

    // 2) Append the loader script at this exact container location.
    const s = document.createElement('script');
    s.async = true;
    s.src =
      'https://indefinitelynutmegbile.com/42723bf5162f297557501cd8d7ccc692/invoke.js';
    container.appendChild(s);

    return () => {
      s.remove();
      if (container.querySelector('iframe')) {
        container.querySelector('iframe').remove();
      }
    };
  }, [variant]);

  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-2 select-none">
        Publicidad
      </span>
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] max-w-full overflow-hidden"
      />
    </div>
  );
}
