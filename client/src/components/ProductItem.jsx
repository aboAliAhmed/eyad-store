/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import {FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa'
import { useDispatch,useSelector } from "react-redux";
import { addToCart, decreaseQuantity } from "../redux/cart/cartSlice";

export default function ProductItem({product}) {
  const dispatch = useDispatch();
  const cart = useSelector((state)=>state.cart.cart)
  
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  }

  const handleDecreaseQuantity = (product) => {
    dispatch(decreaseQuantity(product));
  }

  return (
    <div className="bg-indigo-100/60 w-fit sm:w-[320px] mx-auto my-2 shadow-md hover:shadow-lg transition-shadow overflow-hidden pb-2 rounded-md">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.imageURL} 
          alt="صورة "
          className="w-[86vw] h-[86vw] sm:h-[320px] sm:w-[320px] py-2 px-[10vw] sm:px-4 object-cover hover:scal105 transition-scale duration-300 mx-auto"
        />
        <div className="flex flex-col gap-2 ml-auto p-3">
          <div className="flex justify-between items-center w-full">
            <div className="text-slate-500 flex w-fit mt-2 font-semibold">
              {product.discountedPrice
                ?(
                  <div className='flex justify-center items-center pb-1 py-2'>
                    <p className='text-red-500 flex flex-row mr-2'>
                      <span className="mr-1">جنيه</span>
                      <span>
                        {product.discountedPrice.toLocaleString('en-US')} 
                      </span>
                    </p>
                    <p className='text-gray-600 flex flex-row line-through text-xs'>
                      <span className="mr-1">جنيه</span>
                      <span>
                        {product.regularPrice?.toLocaleString('en-US')}
                      </span>
                    </p>
                  </div>
                )
                : (
                  <p className='text-green-500 flex flex-row text-right'>
                    <span className="mr-1">جنيه</span>
                    <span>
                      {product.regularPrice?.toLocaleString('en-US')}
                    </span>
                  </p>
                )
              }
            </div>
            <p className="truncate text-left text-lg w-fit font-semibold text-slate-700">{product.name}</p>
          </div>
            <p className="text-sm text-gray-600 w-fit ml-auto line-clamp-2">
            {product.description}
            </p>
        </div>
      </Link>
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
  )
}
