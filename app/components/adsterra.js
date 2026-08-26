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
export default function AdsterraAd({
  adKey,
  format = 'iframe',
  width = 300,
  height = 250,
  invokeUrl,
  showLabel = true,
}) {
  const scriptSrc =
    invokeUrl ||
    `https://www.highperformanceformat.com/${adKey}/invoke.js`;

  const srcDoc = `<!doctype html><html><head></head><body style="margin:0;padding:0"><script>window.atOptions={key:'${adKey}',format:'${format}',height:${height},width:${width},params:{}};</script><script src="${scriptSrc}"></script></body></html>`;

  return (
    <div className="flex flex-col items-center justify-center">
      {showLabel && (
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-2 select-none">
          Publicidad
        </span>
      )}
      <div className="max-w-full overflow-hidden" style={{ width, height }}>
        <iframe
          srcDoc={srcDoc}
          style={{ width, height, border: 0, display: 'block' }}
          scrolling="no"
          frameBorder="0"
          loading="lazy"
          title="Publicidad"
        />
      </div>
    </div>
  );
}
