import {FaShoppingCart, FaUser, FaSearch, FaTimes} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaBars } from 'react-icons/fa';


export default function Header() {
  const cart = useSelector((state)=>state.cart.cart)
  const [ searchTerm, setSearchTerm ] = useState(''); 
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  // to get the change of the search bar of the browser as well as the one of the page
  useEffect(()=> {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  } , [location.search])

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <header className=' bg-orange-100 w-[100vw] h-12 sticky top-0 z-10'>
      <div className='flex justify-between items-start max-w-5xl mx-auto p-3 sm:px-5'>
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
          <button>
            <FaSearch className="text-orange-400"/>
          </button>
          <input 
            type="text" 
            placeholder="عما تبحث؟" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-orange-700 focus:outline-none w-20 sm:min-w-36 text-right"
          />
        </form>
        <ul className="hidden sm:flex gap-4 sm:gap-5">
          <Link to='/products'>
            <li className="inline text-orange-400 hover:underline selection:bg-orange-500"> 
              المنتجات
            </li>
          </Link>
          <Link to='/offers'>
            <li className="inline text-orange-400 hover:underline">  
              العروض
            </li>
          </Link>
          <Link to='/contact-us'>
            <li className="inline text-orange-400 hover:underline "> 
              تواصل معنا
            </li>
          </Link>
        </ul>
        <ul className="flex items-start gap-0 sm:gap-2">
          <Link to='/shopping-cart' className='flex'>
            <FaShoppingCart className="text-orange-400 h-5 w-5"/>
            <span 
              className='text-red-500 h-4 w-4 rounded-full text-base mt-[-8px] ml-[-2px] text-center leading-[16px]'
            >{cart.length? cart.length : ''}</span>
          </Link>
          <Link to='/profile' className='hidden sm:flex'>
            <FaUser className="text-orange-400 h-4 w-4"/>
          </Link>
          <div className='flex flex-col items-end sm:hidden w-full'>
            {
              isOpen
                ? <button className='' onClick={() => toggleMenu()}>
                  <FaTimes className="text-orange-400 h-4 w-4 ml-auto"/>
                </button> 
                : <button className='' onClick={() => toggleMenu()}>
                  <FaBars className="text-orange-400 h-4 w-4 ml-auto"/>
                </button>
            }
            {isOpen
              ? <div className='flex flex-col relative'>
              <span className='absolute top-[-9px] right-[5px] w-0 h-1 border-8 border-transparent border-b-orange-300'></span>
              <ul className='absolute right-0 top-[7px] bg-orange-300 text-orange-900 flex flex-col mr-1 p-2 text-right whitespace-nowrap overflow-hidden'>
                <Link to='/products'>
                  <li className='border-b-2 border-white pb-1'>المنتجات</li>
                </Link>
                <Link to='/offers'>
                  <li className='border-b-2 border-white py-1'>العروض</li>
                </Link>
                <Link to='/contact-us'>
                  <li className='border-b-2 border-white py-1'>تواصل معنا</li>
                </Link>
                <Link to='/profile'>
                  <li>الحساب</li>
                </Link>
              </ul>
            </div>
            
              : ''
            }
          </div>
        </ul>
      </div>
    </header>
  )
}
