import Link from 'next/link';

const socialLinks = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/jotaedra',
    icon: (
      <svg x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30" fill="currentColor" aria-hidden="true">
        <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/jotaedra',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 2.04C6.5 2.04 2 6.54 2 12.04C2 17.04 5.66 21.21 10.55 21.96V14.2H7.89V11.2H10.55V8.92C10.55 6.24 12.16 4.74 14.67 4.74C15.86 4.74 16.89 4.93 17.21 5.07V7.6H15.6C14.37 7.6 14.13 8.35 14.13 9.2V11.2H17.13L16.66 14.2H14.13V21.96C19.02 21.21 22.68 17.04 22.68 12.04C22.68 6.54 18.18 2.04 12 2.04Z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/jotaedra',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2ZM12 15.8C14.1 15.8 15.8 14.1 15.8 12C15.8 9.9 14.1 8.2 12 8.2C9.9 8.2 8.2 9.9 8.2 12C8.2 14.1 9.9 15.8 12 15.8ZM16.5 8.2C17.1 8.2 17.6 7.7 17.6 7.1C17.6 6.5 17.1 6 16.5 6C15.9 6 15.4 6.5 15.4 7.1C15.4 7.7 15.9 8.2 16.5 8.2Z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="w-full max-w-[1340px] mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Link
              className="cursor-pointer !no-underline inline-block text-xl font-bold tracking-wider font-display bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-sky-400 dark:via-sky-300 dark:to-indigo-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
              href="/"
            >
              JotaEDRA
            </Link>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Salud, tecnología, entretenimiento y más.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <a
              href="mailto:admin@jotaedra.com"
              className="group inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-sky-400 transition-colors"
            >
              <svg
                className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-sky-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              admin@jotaedra.com
            </a>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  className="cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-all duration-250"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-2 text-xs text-slate-400 dark:text-slate-500">
          <p>© {year} JotaEDRA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}