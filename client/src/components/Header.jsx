import { Link } from "react-router-dom";
import {FaShoppingCart, FaUser, FaSearch} from 'react-icons/fa'

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
        <form className="flex gap-1 sm:gap-5 items-center">
          <input 
            type="text" 
            placeholder="عما تبحث" 
            className="text-orange-700 focus:outline-none w-20 sm:min-w-36"
          />
          <FaSearch className="text-orange-200"/>
        </form>
        <ul className="hidden sm:flex gap-4 sm:gap-5">
          <Link to='/products'>
            <li className="inline text-orange-400 hover:underline"> 
              المنتجات
            </li>
          </Link>
          <Link to='/offers'>
            <li className="inline text-orange-400 hover:underline">  
              العروض
            </li>
          </Link>
          <Link to='/contact-us'>
            <li className="inline text-orange-400 hover:underline"> 
              تواصل معنا
            </li>
          </Link>
        </ul>
        <ul className="flex gap-1 sm:gap-2">
          <Link to='/shopping-cart'>
          <FaShoppingCart className="text-orange-200"/>
          </Link>
          <Link to='/profile'>
          <FaUser className="text-orange-200"/>
          </Link>
        </ul>
      </div>
    </header>
  )
}
