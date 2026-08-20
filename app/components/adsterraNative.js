'use client';

import Script from 'next/script';

/**
 * Adsterra Native Banner (container-based placement).
 *
 * Unlike the iframe format, Adsterra's native banner uses a direct
 * `invoke.js` + `<div id="container-{key}">` pair. The script renders into
 * that container by id (no global `atOptions` involved), so it can coexist
 * with the other ad placements on the page. `next/script` hoists the loader
 * into <body>; that's fine because the script locates its container by id.
 *
 * Usage:
 *   <AdsterraNative />
 */
const KEY = 'ea8ee4a51f55f54788c6620e8c4119a6';

export default function AdsterraNative() {
  return (
    <div className="w-full flex justify-center my-8">
      <div id={`container-${KEY}`} className="w-full max-w-[728px]" />
      <Script
        src={`https://pl30757504.effectivecpmnetwork.com/${KEY}/invoke.js`}
        strategy="afterInteractive"
      />
    </div>
  );
}
