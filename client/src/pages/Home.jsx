import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductItem from '../components/ProductItem'

export default function Home() {
  const [products, setProducts] = useState(null);
  const [offerProducts, setOfferProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [recentOffers, setRecentOffers] = useState([]);
  const params = useParams();

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
          اعثر على 
          <span className='text-orange-500'> الهدية</span> 
          <br /> 
          اللتي تُريد
        </h1>
        <div className='text-[#462416] text-xs sm:text-sm lg:text-base text-right'>
          خير ما يُستقبل به مواسم الطاعات: كثرة الاستغفار؛ <br />
          لأن ذنوب العبد تحرمه التوفيق، وما ألزمَ عبد قلبه الاستغفار إلا زكا، <br />
          وإن كان ضعيفًا قوي، وإن كان مريضًا شُفي، وإن كان مبتلى عوفي، <br />
          وإن كان محتارًا هُدي، وإن كان مضطربًا سكن
        </div>
        <Link 
          className='text-xs text-[#a55b3b] font-bold hover:underline text-right'
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