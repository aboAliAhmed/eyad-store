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
    <header className='w-full fixed z-20'>
      <div className='flex items-center bg-orange-100 w-full h-16 sticky top-0 z-10 drop-shadow-md hover:drop-shadow-xl select-none'>
        <div className='flex justify-between items-center w-full mx-auto px-[5vw]'>
          <ul className="flex items-start gap-0 sm:gap-2">
            <div className='flex flex-col items-end sm:hidden w-full sm:pr-2'>
              {
                isOpen
                  ? <button className='' onClick={() => toggleMenu()}>
                    <FaTimes className="text-orange-600 h-4 w-4 ml-auto"/>
                  </button> 
                  : <button className='' onClick={() => toggleMenu()}>
                    <FaBars className="text-orange-600 h-4 w-4 ml-auto"/>
                  </button>
              }
              {isOpen
                ? <div className='flex flex-col relative'>
                    <span className='absolute top-[-5px] right-0 w-0 h-1 border-8 border-transparent border-b-orange-300'></span>
                    <ul className='absolute left-[-20px] top-[10px] flex flex-col bg-orange-300 text-orange-900 mr-1 p-2 text-right whitespace-nowrap overflow-hidden rounded-lg'>
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
            <Link to='/profile' className='hidden sm:flex'>
              <FaUser className="text-orange-600 h-4 w-4"/>
            </Link>
            <Link to='/shopping-cart' className='flex'>
              <FaShoppingCart className="text-orange-600 h-5 w-5 ml-1"/>
              <span 
                className='text-red-500 h-4 w-4 rounded-full text-base mt-[-8px] ml-[-2px] text-center leading-[16px]'
              >{cart.length? cart.length : ''}</span>
            </Link>
          </ul>
          <ul className="hidden sm:flex sm:gap-1 md:gap-6 text-orange-900 text-nowrap ">
            <Link to='/contact-us'>
              <li className="inline hover:bg-yellow-50 hover:p-2 hover:underline rounded-lg transition-all duration-300 ease-in-out">  
                تواصل معنا
              </li>
            </Link>
            <Link to='/offers'>
              <li className="inline hover:bg-yellow-50 hover:p-2 hover:underline rounded-lg transition-all duration-300 ease-in-out">  
                العروض
              </li>
            </Link>
            <Link to='/products'>
              <li className="inline hover:bg-yellow-50 hover:p-2 hover:underline rounded-lg transition-all duration-300 ease-in-out">  
                المنتجات
              </li>
            </Link>
          </ul>
          <form 
            onSubmit={handleSubmit} 
            className="flex justify-end gap-1 bg-white px-1 md:px-2 items-center rounded-lg"
          >
            <button className='hidden sm:inline-block h-10'>
              <FaSearch className="text-orange-900 hover:bg-orange-50"/>
            </button>
            <input 
              type="text" 
              placeholder="عما تبحث؟" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none w-[25vw] sm:w-28 sm:focus:w-[25vw] h-10 text-right transition-all duration-300 ease-in-out"
            />
          </form>
          <Link to='/'>
            <h1 className="font-black text-[6vw] sm:text-3xl sm:tracking-[1px] arapey-regular text-nowrap mx-1 md:mx-2">
              <span className="text-[#ff5900]">متجر</span>
              <span className="text-[#ff3700]"> إياد</span>
            </h1>
          </Link>        
        </div>
      </div>
    </header>
  )
}
