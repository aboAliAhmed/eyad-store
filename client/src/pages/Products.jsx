import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
      {/* top */}
      <div className='flex justify-center flex-wrap gap-1'>
        <button 
          onClick={() => fetcData('ساعات')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          ساعات
        </button>
        <button 
          onClick={() => fetcData('محافظ')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          محافظ
        </button>
        <button 
          onClick={() => fetcData('مجات')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          مجات
        </button>
        <button 
          onClick={() => fetcData('إكسسوارات حريمي')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          إكسسوارات حريمي
        </button>
        <button 
          onClick={() => fetcData('أنتيكات')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          أنتيكات
        </button>
        <button 
          onClick={() => fetcData('ديكورات')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          ديكورات
        </button>
        <button 
          onClick={() => fetcData('عطور')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          عطور
        </button>
        <button 
          onClick={() => fetcData('مطبوعات')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          مطبوعات
        </button>
        <button 
          onClick={() => fetcData('حفر ليزر')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          حفر ليزر
        </button>
        <button 
          onClick={() => fetcData('صواني شبكة')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          صواني شبكة
        </button>
        <button 
          onClick={() => fetcData('طارات')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          طارات
        </button>
        <button 
          onClick={() => fetcData('مشغولات يدوية')}
          className='bg-orange-500 text-white rounded-md p-1'
        >
          مشغولات يدوية
        </button>
      </div>
      <div className='mx-auto p-3 flex flex-col gap-8 my-5 text-right'>
        <div className='my-3'>     
          <div className='flex flex-wrap justify-between items-center gap-2'>
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