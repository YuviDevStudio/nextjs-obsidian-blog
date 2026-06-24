import '../styles/global.css';
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import Navbar from './components/navbar';
import SubNavbar from './components/sub-navbar';
import { ThemeProvider } from './components/theme-provider';
import { getAllTags } from '../lib/posts';
import { Inter, Outfit } from 'next/font/google';

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
  title: 'My Blog',
  description: 'My personal blog',
};

export default function RootLayout({ children }) {
  const tags = getAllTags();
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <ThemeProvider>
          <Navbar />
          <SubNavbar tags={tags} />
          <main className="w-full max-w-[1340px] mx-auto px-4 md:px-6 py-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

