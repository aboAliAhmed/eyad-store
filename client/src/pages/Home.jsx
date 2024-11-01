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
    <main className=''>
      {/* top */}
      <div className='bg-gradient-to-b from-[#ffd0bc] via-[#ffd0bc] to-[#fff0e7] flex flex-col py-28 pr-5 sm:pr-20 lg:pr-40 gap-6 h-[60vh]'>
        <h1 className='ibm-plex-sans-arabic tracking-wide font-bold text-3xl sm:text-4xl lg:text-6xl text-right mt-16'>
          <span className='text-orange-700'>متجر لبيع </span>
          <span className='text-orange-600 mx-1'>الهدايا</span> 
        </h1>
        <div className='text-[#381101] text-sm lg:text-base text-right'>
        هنا تجد ما يُسعدك
        <br />
        حيث الهدايا القيِّمة من الساعات والعطور والكماليات
        </div>
        <Link 
          to={'/products'}
          className='text-[#8a3e1d] w-fit ml-auto font-bold hover:underline text-right text-sm'
        >
          هَيا بنا؟
        </Link>
      </div>
      <div className='flex flex-col gap-8 my-10 text-right sm:mx-2 md:mx-10 py-3'>
        <div className='my-3 lg:mx-20'>     
          <h2 className='text-2 font-semibold text-orange-600'>أحدث العروض</h2>
          <div className='flex flex-wrap justify-center sm:justify-between items-center gap-2'>
            {recentOffers && recentOffers.length > 0 && recentOffers.map((product) =>(<ProductItem key={product._id} product={product}/>))}
          </div>
          <Link 
            to={'/search?offer=true'}
            className='text-orange-800 text-sm hover:underline'
          >
            المزيد من العروض
          </Link>
        </div>
        <div className='my-3 lg:mx-20'>     
          <h2 className='text-2 font-semibold text-orange-600'>أحدث المنتجات</h2>
          <div className='flex flex-wrap justify-center sm:justify-between items-center gap-2'>
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