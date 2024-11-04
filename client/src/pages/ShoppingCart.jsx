import { useDispatch, useSelector } from "react-redux"
import { addToCart, decreaseQuantity } from "../redux/cart/cartSlice"
import { Link } from "react-router-dom"
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa"

export default function ShoppingCart() {
  const cart = useSelector((state)=>state.cart.cart)
  const dispatch = useDispatch()


  const handleDecreaseQuantity = (product) => {
    dispatch(decreaseQuantity(product));
  }

  const handleIncreaseQuantity = (product) => {
    dispatch(addToCart(product));
  }

  return (
    <main className=' flex flex-col md:flex-row justify-around py-[4%]'>
      <div>
        {cart.length === 0 
        ? <h1 className="text-red-500 font-bold text-xl text-center">سلة المشتريات لا زالت فارغة</h1> 
        : ''}
        {cart.map(el => (
          <div 
            key={el._id} 
            className='w-[92vw] sm:w-[600px] flex items-center gap-3 my-3 mx-auto md:ml-2 p-2 border-2 border-orange-500'
          >
            <Link to={`/product/${el._id}`} >
              <img 
                src={el.imageURL} 
                alt="" 
                className='w-[27vw] h-[27vw] sm:w-[200px] sm:h-[180px]'
              />
            </Link>
            <div className="w-[50vw] h-[27vw] sm:w-[320px] sm:h-[180px] ml-auto flex flex-col justify-between">
              <button 
                onClick={() => handleDecreaseQuantity(el)} 
                className="text-[#ff0000] w-fit h-fit self-end justify-self-start"
              >
                <FaTimes />
              </button>
              <div 
                className="flex justify-between items-center mx-1"
              >
                <p className="text-nowrap">{`جنيه ${el.offer? el.discountedPrice : el.regularPrice} `}</p>
                <h2 className="w-auto line-clamp-1" style={{direction: 'rtl', textOverflow: 'ellipsis'}}>{el.name}</h2>
              </div>
              {cart.find(item => item._id === el._id)?.orderedQuantity > 0
                ?(
                  <div className=" flex justify-between">
                    <button 
                      onClick={()=> handleDecreaseQuantity(el)}
                      className="bg-[#8e61a0] text-white flex justify-center items-center w-1/3 rounded-lg p-2"
                    >
                      <FaMinus />
                    </button>
                    <span
                      className="text-orange-900"
                      >{cart.find(item => item._id === el._id).orderedQuantity}</span>
                    <button 
                      onClick={()=> handleIncreaseQuantity(el)}
                      className="bg-[#8e61a0] text-white flex justify-center items-center w-1/3 rounded-lg p-2" 
                    >
                      <FaPlus />
                    </button>
                  </div>
                ): ''}
              </div>
          </div>
        ))}
      </div>
      {cart.length > 0 ?(
        <Link to={'/adress'}>
          <p 
            className="bg-[#3d2646] text-white w-[92vw] sm:w-[600px] md:w-[20vw] md:h-fit mx-auto md:mx-0 text-center md:mt-20 py-2 rounded-lg"
          >
            إستكمال الطلب
          </p>
        </Link>) 
      : ''}
    </main>
  )
}
