import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ErrorComponent from '../components/ErrorComponent';
import { FaShoppingCart } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';

export default function Product() {
//   SwiperCore.use([Navigation]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const currentUser = useSelector((state) => state.user.currentUser)

  useEffect(()=>{
    const fetchProduct = async () => {
      try {
        console.log(params.productId)
        setLoading(true);
        const res =await fetch(`/api/v1/product/${params.productId}`);
        const data = await res.json();
        if (data.status !== 'success') {
          setError(true);
          setLoading(false);
          return;
        }
        setProduct(data.data.product);
        setLoading(false);
        setError(false);
      } catch (err) {
        console.log(err)
        setError(true);
        console.log(err);
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.productId])
  return (
    <main className='w-full p-[4%]'>
      {loading && <p className='text-center mt-7 text-2xl'>...انتظر</p>}
      {error && (<ErrorComponent />)}
      {product && !loading && !error && (
      <div className='w-[92vw] sm:w-[600px] mx-auto overflow-hidden'>
        <img 
            src={product.imageURL} 
            alt="" 
            className='w-[90vw] h-[90vw] sm:w-[576px] sm:h-[600px] object-fill m-auto'
        />
          <div className='flex flex-col max-w-[550px] mx-auto mt-4 gap-4'>
            <div 
              className='text-2xl font-semibold w-full grid sm:flex flex-row-reverse justify-center sm:justify-between items-center'
            >
              <p className='mx-auto  sm:mr-2 w-fit'>
                {product.name}
              </p>
              {product.discountedPrice
                ?(
                  <div className='flex justify-center items-center pb-1 py-2'>
                    <p className='text-red-500 flex flex-row mr-2'>
                      <span className="mr-1">جنيه</span>
                      <span>
                        {(product.regularPrice - product.discountedPrice).toLocaleString('en-US')} 
                      </span>
                    </p>
                    <p className='text-gray-600 flex flex-row line-through text-xs'>
                      <span className="mr-1">جنيه</span>
                      <span>
                        {product.regularPrice.toLocaleString('en-US')}
                      </span>
                    </p>
                  </div>
                )
                : (
                  <p className='text-green-500 flex flex-row text-right'>
                    <span className="mr-1">جنيه</span>
                    <span>
                      {product.regularPrice.toLocaleString('en-US')}
                    </span>
                  </p>
                )
              }
            </div>
            <p className='text-slate-800 w-fit text-right ml-auto pr-3'>
              {product.description}
            </p>
            <button className="bg-orange-500 text-white flex justify-between items-center w-[96%] mx-auto py-[3%] px-6 rounded-lg">
              <button className="bg-orange-800 rounded-full p-2">
                <FaMinus />
              </button>
              <div className="flex justify-between items-center mx-auto ">
                <FaShoppingCart className="mr-1"/>
                <span>
                  أضف إلى 
                </span>
              </div>
              <button className="bg-orange-800 rounded-full p-2" >
                <FaPlus />
              </button>
          </button>
          </div>
        </div>
      )}
    </main>
  )
}
 