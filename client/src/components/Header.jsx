import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className='shadow-md'>
      <div className='flex justify-between items-center max-w-5xl mx-auto py-3 px-5'>
        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl">
            <span className="text-orange-600">متجر</span>
            <span className="text-orange-500"> إياد</span>
          </h1>
        </Link>
        <form>
          <ul className="flex gap-4 sm:gap-5">
            <Link to='/products'>
              <li className="sm:inline text-orange-400 hover:underline"> 
                المنتجات
              </li>
            </Link>
            <Link to='/offers'>
              <li className="hidden sm:inline text-orange-400 hover:underline">  
                العروض
              </li>
            </Link>
            <Link to='/contact-us'>
              <li className="hidden sm:inline text-orange-400 hover:underline"> 
                تواصل معنا
              </li>
            </Link>
          </ul>
        </form>
      </div>
    </header>
  )
}
