import '../styles/global.css';
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import Navbar from './components/navbar';
import SubNavbar from './components/sub-navbar';
import { ThemeProvider } from './components/theme-provider';

export const metadata = {
  title: 'My Blog',
  description: 'My personal blog',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          <SubNavbar />
          <div className="flex flex-row justify-center max-w-[1200px] mx-auto">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
