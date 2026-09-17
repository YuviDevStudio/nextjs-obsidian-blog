import '../styles/global.css';
import Navbar from './components/navbar';
import SubNavbar from './components/sub-navbar';
import Footer from './components/footer';
import { ThemeProvider } from './components/theme-provider';
import { getAllTags, getSearchIndex } from '../lib/posts';
import { Inter, Outfit } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  metadataBase: new URL('https://jotaedra.com'),
  title: {
    default: 'JotaEDRA',
    template: '%s | JotaEDRA',
  },
  description:
    'Aquí se habla de IA, tecnología, salud, noticias, entretenimiento y más...',
  icons: {
    icon: '/favicon.png',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Runs before paint so dark mode matches localStorage / system preference (no FOUC). */
const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    var dark = t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  const tags = getAllTags();
  const searchIndex = getSearchIndex();

  return (
    <html
      lang="es"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${outfit.variable}`}
    >
      <head>
        {/* AdSense verification + auto-ads: plain tags (not next/script) so the
            exact snippets ship verbatim in SSR HTML for Google's crawler. */}
        <meta name="google-adsense-account" content="ca-pub-9956672685720320" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9956672685720320"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Inline before interactive UI so dark class is set before first paint when possible */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <Navbar searchPosts={searchIndex} />
          <SubNavbar tags={tags} />
          <main className="w-full max-w-[1340px] mx-auto px-4 md:px-6 py-6">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <GoogleAnalytics gaId="G-9K841MNERH" />
      </body>
    </html>
  );
}
