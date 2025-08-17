'use client'

import Link from "next/link"
import { useTheme } from './theme-provider';

const SubNavbar = () => {
  const { theme } = useTheme()
  return (
    <div className={`bg-${theme === 'dark' ? 'gray-700' : 'white'}`}>
      <nav className=" text-[14px] max-w-[1200px] mx-auto">
        <ul className="flex flex-row overflow-x-auto whitespace-nowrap justify-start md:justify-center gap-4 md:gap-8 p-1 shadow-md no-scrollbar">
          <li>
            <Link
              href="/"
          className="!no-underline text-gray-800 dark:text-white font-bold">
            J
            <span className={`italic ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              ota
              </span>
                Noticias
          </Link>
        </li>
        <li>
          <Link 
          href="/" 
          className="!no-underline text-gray-800 dark:text-white font-bold">
            J
            <span className={`italic ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              ota
              </span>
                Finanzas
          </Link>
        </li>
        <li>
          <Link
          href="/" 
          className="!no-underline text-gray-800 dark:text-white font-bold">
            J
            <span className={`italic ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              ota
              </span>
              Salud
          </Link>
        </li>
        <li>
          <Link
          href="/" 
          className="!no-underline text-gray-800 dark:text-white font-bold">
            J
            <span className={`italic ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              ota
              </span>
              Tecnología
          </Link>
        </li>
        <li>
          <Link
          href="/" 
          className="!no-underline text-gray-800 dark:text-white font-bold">
            J
            <span className={`italic ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              ota
              </span>
              Code
          </Link>
        </li>
      </ul>
    </nav>
    </div>
  )
}

export default SubNavbar