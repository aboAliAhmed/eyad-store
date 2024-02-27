import {FaShoppingCart, FaUser, FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function Header() {
  const [ searchTerm, setSearchTerm ] = useState(''); 
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(()=> {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  } , [location.search])
  return (
    <header className=' bg-orange-100 w-full block sticky top-0 z-10'>
      <div className='flex justify-between items-center max-w-5xl mx-auto py-3 px-5'>
        <Link to='/'>
          <h1 className="font-black text-sm sm:text-xl">
            <span className="text-orange-600">متجر</span>
            <span className="text-orange-500"> إياد</span>
          </h1>
        </Link>
        <form 
          onSubmit={handleSubmit} 
          className="flex gap-1 sm:gap-5 items-center bg-white rounded px-2"
        >
          <input 
            type="text" 
            placeholder="عما تبحث؟" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-orange-700 focus:outline-none w-20 sm:min-w-36"
          />
          <button>
            <FaSearch className="text-orange-400"/>
          </button>
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
        <ul className="flex justify-center items-center gap-1 sm:gap-2">
          <Link to='/shopping-cart'>
            <FaShoppingCart className="text-orange-400 h-5 w-5"/>
          </Link>
          <Link to='/profile'>
            <FaUser className="text-orange-400 h-4 w-4"/>
          </Link>
        </ul>
      </div>
    </header>
  )
}
