'use client';

import { useState, useCallback } from 'react';
import AdsterraAd from './adsterra';
import AdsterraNativeSidebar from './adsterraNativeSidebar';

/**
 * Left-rail 160x600 skyscraper wrapper for post pages.
 *
 * The 160x600 unit frequently returns no-fill (empty watch.js). Instead of
 * leaving a 160x600 white box (or an empty gap), fall back to the native
 * placement which fills reliably. The native runs in its own srcdoc iframe
 * so sharing the key with the other native slots can't collide.
 * Only when both fail do we unmount the rail.
 */
export default function SkyscraperRail({
  adKey,
  invokeUrl,
  width = 160,
  height = 600,
}) {
  const [stage, setStage] = useState('banner'); // 'banner' | 'native' | 'hidden'

  const handleBannerStatus = useCallback((status) => {
    if (status === 'empty') setStage('native');
  }, []);

  if (stage === 'hidden') return null;

  return (
    <aside className="hidden xl:flex flex-col w-[160px] sticky top-24 shrink-0 select-none">
      {stage === 'banner' ? (
        <AdsterraAd
          adKey={adKey}
          invokeUrl={invokeUrl}
          width={width}
          height={height}
          onStatusChange={handleBannerStatus}
        />
      ) : (
        <div className="w-[160px] overflow-hidden">
          <AdsterraNativeSidebar width={160} />
        </div>
      )}
    </aside>
  );
}
