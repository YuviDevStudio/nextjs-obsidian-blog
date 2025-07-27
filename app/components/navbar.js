import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-gray-100 p-2 shadow-md z-50">
      <div className="flex justify-between items-center z-10 max-w-[1200px] mx-auto">
        <Link className="cursor-pointer !no-underline text-xl font-bold" href="/">
          J<span className='text-black italic'>ota</span>EDRA
        </Link>
        <div>
          <Link className="cursor-pointer !no-underline" href="https://x.com/jotaedra" target="_blank" rel="noopener noreferrer">
            <svg x="0px" y="0px" width="36" height="36" viewBox="0 0 30 30">
              <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
