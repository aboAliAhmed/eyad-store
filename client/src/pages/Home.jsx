import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductItem from '../components/ProductItem'
import { useSelector } from 'react-redux';

export default function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [recentOffers, setRecentOffers] = useState([]);
  useEffect(() => {

    const fetchLatestProducts = async () => {      
      try {
        const res = await fetch(`api/v1/product?sort=createdAt&order=desc`);
        const data = await res.json();
        setLatestProducts(data.data.product);
      } catch (err) {
        console.log(err);
      }
    }

    const fetchRecentOffers = async () => {      
      try {
        const res = await fetch(`api/v1/product?offer=true&&sort=createdAt&order=desc`);
        const data = await res.json();
        setRecentOffers(data.data.product);
      } catch (err) {
        console.log(err);
      }
    }

    fetchLatestProducts();
    fetchRecentOffers();
  }, [])
  return (
    <main>
      {/* top */}
      <div className='bg-orange-200 flex flex-col p-[2%] sm:p-[5%] lg:pr-80 gap-6'>
        <h1 className='text-orange-700 font-bold text-3xl lg:text-6xl text-right'>
          <span>متجر لبيع </span>
          <span className='text-orange-500 mx-1'>الهديا</span> 
        </h1>
        <div className='text-[#462416] text-xs sm:text-sm lg:text-base text-right'>
        هنا تجد كل ما يُسعدك
          <br />
          متخصصون في بيع ما يُدخل السرور والبهجة على القلب
        </div>
        <Link 
          to={'/products'}
          className='text-[#a55b3b] w-fit ml-auto font-bold hover:underline text-right text-xs '
        >
          هَيا بنا؟
        </Link>
      </div>
      <div className='mx-auto p-3 flex flex-col gap-8 my-10 text-right'>
        <div className='my-3'>     
          <h2 className='text-2 font-semibold text-orange-600'>أحدث العروض</h2>
          <div className='flex flex-wrap justify-between items-center gap-2'>
            {recentOffers && recentOffers.length > 0 && recentOffers.map((product) =>(<ProductItem key={product._id} product={product}/>))}
          </div>
          <Link 
            to={'/search?offer=true'}
            className='text-orange-800 text-sm hover:underline'
          >
            المزيد من العروض
          </Link>
        </div>
        <div className='my-3'>     
          <h2 className='text-2 font-semibold text-orange-600'>أحدث المنتجات</h2>
          <div className='flex flex-wrap justify-between items-center gap-2'>
            {latestProducts && latestProducts.length > 0 && latestProducts.map((product) =>(<ProductItem key={product._id} product={product}/>))}
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