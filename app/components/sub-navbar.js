import Link from "next/link"

const SubNavbar = () => {
  return (
    <nav className="bg-blue-200 text-[14px] max-w-[1200px] mx-auto">
      <ul className="flex flex-row overflow-x-auto whitespace-nowrap justify-start md:justify-center gap-4 md:gap-8 p-1 shadow-md no-scrollbar">
        <li>
          <Link href="/" className="!no-underline text-white font-bold">J<span className="!text-black italic">ota</span>Noticias</Link>
        </li>
        <li>
          <Link href="/" className="!no-underline text-white font-bold">J<span className="!text-black italic">ota</span>Salud</Link>
        </li>
        <li>
          <Link href="/" className="!no-underline text-white font-bold">J<span className="!text-black italic">ota</span>tecnología</Link>
        </li>
        <li>
          <Link href="/" className="!no-underline text-white font-bold">J<span className="!text-black italic">ota</span>Programación</Link>
        </li>
      </ul>
    </nav>
  )
}

export default SubNavbar