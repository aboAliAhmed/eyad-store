import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductItem from '../components/ProductItem'
import { FaExclamation } from 'react-icons/fa';

export default function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [catName, setCatName] = useState([]);
  const [data, setdata] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {      
      try {
        const res = await fetch(`api/v1/product?available=true&sort=createdAt&order=desc`);
        const data = await res.json();
        setLatestProducts(data.data.product);
      } catch (err) {
        console.log(err);
      }
    }
    fetchLatestProducts();
  }, [])

  const fetcData = async (category) => {      
    try {
      category.replace(/\s/g, '');
      setClicked(true)
      setCatName(category)
      const res = await fetch(`api/v1/product?type=${category}&available=true&sort=createdAt&order=desc`);
      const data = await res.json();
      setdata(data.data.product);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main>
      <div className='w-11/12 mx-auto sm:px-5'>
        <div className=''>
          <div className='flex space-x-2 group text-nowrap pt-20 pb-5'>
            <div className='animate-loop-scroll flex space-x-2 sm:space-x-6 lg:space-x-16 lg:mr-8 group-hover:paused'>
              {[
                'ساعات', 'محافظ', 'مجات', 'إكسسوارات حريمي', 'أنتيكات',
                'ديكورات', 'عطور', 'مطبوعات', 'حفر ليزر', 'صواني شبكة',
                'طارات', 'مشغولات يدوية'
              ].map(category => (
                <button 
                  key={category}
                  onClick={() => fetcData(category)}
                  className='bg-rose-950 hover:bg-red-900 text-white rounded-md py-2 px-1 sm:px-4 transform transition-transform'
                >
                  {category}
                </button>
              ))}
            </div>
            <div aria-hidden="true" className='animate-loop-scroll flex space-x-2 sm:space-x-6 lg:space-x-16 lg:mr-8 group-hover:paused'>
              {[
                'ساعات', 'محافظ', 'مجات', 'إكسسوارات حريمي', 'أنتيكات',
                'ديكورات', 'عطور', 'مطبوعات', 'حفر ليزر', 'صواني شبكة',
                'طارات', 'مشغولات يدوية'
              ].map(category => (
                <button 
                  key={category}
                  onClick={() => fetcData(category)}
                  className='bg-rose-950 hover:bg-red-900 text-white rounded-md py-2 px-1 sm:px-4 transform transition-transform'
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='mx-auto p-3 flex flex-col gap-8 my-5 text-right'>
        <div className='my-3'>     
          <div className='flex flex-wrap justify-between items-center w-fit mx-auto gap-2'>
            <div className='w-fit mx-auto flex flex-col justify-center items-center'>
              { data && data.length > 0 
              ? data.map((product) => (<ProductItem key={product._id} product={product}/>)) 
              : (
                <div>
                  {clicked 
                  ?<div className='flex justify-center items-center w-fit mx-auto mb-4 text-lg'>
                    <p 
                      className='w-fit p-1 mx-auto'
                    >لا توجد <span className='text-[#ff0000]'>{catName}</span> في الوقت الحالي
                    </p> 
                    <FaExclamation className='text-[#ff0000] text-3xl'/> 
                  </div>
                  : ''} 
                  <h2 className='text-orange-600 text-xl mr-6 mb-2'>أحدث المنتجات</h2>
                  <div className='flex flex-wrap justify-between items-center gap-2'>
                  {latestProducts && latestProducts.length > 0 && latestProducts.map((product) =>(<ProductItem key={product._id} product={product}/>))}
                  </div>
                </div>
              )
                }
            </div>
          </div>
          <Link 
            to={'/search?sort=created-at&order=asc'}
            className='text-orange-800 text-sm hover:underline'
          >
            المزيد من المنتجات
          </Link>
        </div>
      </div>
    </main>
  )
}