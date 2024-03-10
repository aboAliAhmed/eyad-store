import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ErrorComponent from '../components/ErrorComponent';
import { FaShoppingCart } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { addToCart, decreaseQuantity } from "../redux/cart/cartSlice";

export default function Product() {
//   SwiperCore.use([Navigation]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const cart = useSelector((state)=>state.cart.cart)

  useEffect(()=>{
    const fetchProduct = async () => {
      try {
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

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  }

  const handleDecreaseQuantity = (product) => {
    dispatch(decreaseQuantity(product));
  }

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
          {cart.length === 0 || 
          !cart.find(item => item._id === product._id) || 
          cart.find(item => item._id === product._id)?.orderedQuantity === 0
          ? (<button 
            onClick={() => handleAddToCart(product)}
            className="bg-orange-500 text-white flex justify-center items-center w-[96%] mx-auto py-[3%] px-6 rounded-lg"
          >
            <FaShoppingCart className="mr-1"/>
            <span>
              أضف إلى 
            </span>  
          </button>) 
          : cart.find(item => item._id === product._id)?.orderedQuantity > 0
          ? ( <div className=" flex justify-between mx-2">
            <button 
              onClick={()=> handleDecreaseQuantity(product)}
              className="bg-orange-500 text-white flex justify-center items-center w-1/3 rounded-lg p-2"
            >
              <FaMinus />
            </button>
            <span
              className="text-orange-900"
              >{cart.find(item => item._id === product._id).orderedQuantity}</span>
            <button 
              onClick={()=> handleAddToCart(product)}
              className="bg-orange-500 text-white flex justify-center items-center w-1/3 rounded-lg p-2" 
            >
              <FaPlus />
            </button>
            </div> ) 
            : ''
            }
          </div>
        </div>
      )}
    </main>
  )
}
 