'use client';

import Link from 'next/link';
import ThemeToggle from './theme-toggle';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from './theme-provider';

export default function Navbar() {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const searchRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) { // Scrolling down
        setNavbarVisible(false);
      } else if (currentScrollY < lastScrollY) { // Scrolling up
        setNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const menuRef = useRef(null);

  useEffect(() => {
    let timerId;
    if (isMenuOpen) {
      timerId = setTimeout(() => {
        searchRef.current?.focus();
      }, 300);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className={`sticky top-0 p-2 shadow-md z-50 mx-auto transition-transform duration-300 ease-in-out ${navbarVisible ? 'translate-y-0' : '-translate-y-full'} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between">
          {/* Left Section: Hamburger Menu */}
          <div className="flex items-center flex-none">
            <button onClick={toggleMenu} className={`focus:outline-none ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          
          {/* Center Section: Title */}
          <div className="flex-grow text-center flex justify-center">
            <Link className="cursor-pointer !no-underline text-xl font-bold text-gray-800 dark:text-white" href="/">
              J<span className={`italic ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>ota</span>EDRA
            </Link>
          </div>

          {/* Right Section: Search Icon */}
          <div className="flex items-center flex-none">
            
            {/* Search Icon (Desktop) */}
            <button onClick={toggleMenu} className={`flex items-center focus:outline-none ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Menu */}
      <div ref={menuRef} className={`fixed top-0 left-0 w-2/3 md:w-1/3 h-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-60 shadow-xl`}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between">
            <Link className="cursor-pointer !no-underline text-xl font-bold" href="/">
              J<span className={`italic ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>ota</span>EDRA
            </Link>
            <div className="flex items-center">
              <ThemeToggle />
              <button onClick={toggleMenu} className={`p-2 focus:outline-none ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4 relative">
            <svg className={`absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              ref={searchRef}
              type="text"
              placeholder="Buscar..."
              className={`p-2 pl-10 w-full border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            />
          </div>
          <div className="flex flex-col items-center justify-center flex-grow space-y-8">
            {/* Social Media Icons */}
            <Link className="cursor-pointer" href="https://x.com/jotaedra" target="_blank" rel="noopener noreferrer">
              <svg x="0px" y="0px" width="48" height="48" viewBox="0 0 30 30" fill="currentColor">
                <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>
              </svg>
            </Link>
            <Link className="cursor-pointer" href="https://facebook.com/jotaedra" target="_blank" rel="noopener noreferrer">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.04C6.5 2.04 2 6.54 2 12.04C2 17.04 5.66 21.21 10.55 21.96V14.2H7.89V11.2H10.55V8.92C10.55 6.24 12.16 4.74 14.67 4.74C15.86 4.74 16.89 4.93 17.21 5.07V7.6H15.6C14.37 7.6 14.13 8.35 14.13 9.2V11.2H17.13L16.66 14.2H14.13V21.96C19.02 21.21 22.68 17.04 22.68 12.04C22.68 6.54 18.18 2.04 12 2.04Z"/>
              </svg>
            </Link>
            <Link className="cursor-pointer" href="https://instagram.com/jotaedra" target="_blank" rel="noopener noreferrer">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2ZM12 15.8C14.1 15.8 15.8 14.1 15.8 12C15.8 9.9 14.1 8.2 12 8.2C9.9 8.2 8.2 9.9 8.2 12C8.2 14.1 9.9 15.8 12 15.8ZM16.5 8.2C17.1 8.2 17.6 7.7 17.6 7.1C17.6 6.5 17.1 6 16.5 6C15.9 6 15.4 6.5 15.4 7.1C15.4 7.7 15.9 8.2 16.5 8.2Z"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
