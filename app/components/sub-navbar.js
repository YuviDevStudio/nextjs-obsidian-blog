import Link from "next/link"

const SubNavbar = () => {
  return (
    <nav className="bg-blue-200 text-[14px]">
      <ul className="flex flex-row justify-center gap-8 p-1 shadow-md">
        <li>
          <Link href="/" className="!no-underline text-white font-bold">J<span className="!text-black italic">ota</span>{' '}Noticias</Link>
        </li>
        <li>
          <Link href="/" className="!no-underline text-white font-bold">J<span className="!text-black italic">ota</span>{' '}Salud</Link>
        </li>
        <li>
          <Link href="/" className="!no-underline text-white font-bold">J<span className="!text-black italic">ota</span>{' '}tecnología</Link>
        </li>
        <li>
          <Link href="/" className="!no-underline text-white font-bold">J<span className="!text-black italic">ota</span>{' '}Programación</Link>
        </li>
      </ul>
    </nav>
  )
}

export default SubNavbar