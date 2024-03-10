import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {clearCart} from '../redux/cart/cartSlice'

export default function Address() {
  const cart = useSelector((state)=>state.cart.cart)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [orderedData, setOrderedData] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    government: '',
    city: '',
    streetAndAppartmentNo: '',
    products:[]
  })
  const dispatch = useDispatch();

  useEffect(() => {
    let products = [];
    for (let i = 0; i < cart.length; i++) {
      let price = cart[i].offer? cart[i].discountedPrice : cart[i].regularPrice
      let quantity = cart[i].orderedQuantity
      let productPrice = price * quantity
      products.push({
        product: cart[i]._id,
        name: cart[i].name,
        quantity: quantity,
        totalPrice: productPrice
      });
    }

    setFormData({
      ...formData,
      products: products
    });
    }, [cart]);

    console.log(formData)

  const handleChange = (e) => {
    switch (e.target.id) {
      case 'username':
        setFormData({...formData, username: e.target.value})
        break;
      case 'phone':
        setFormData({...formData, phone: e.target.value})
        break;
      case 'government':
        setFormData({...formData, government: e.target.value})
        break;
      case 'city':
        setFormData({...formData, city: e.target.value})
        break;
      case 'streetAndAppartmentNo':
        setFormData({...formData, streetAndAppartmentNo: e.target.checked})
        break;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        setError(false);
        console.log('data')
        const res = await fetch('/api/v1/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        setOrderedData(data);
        setLoading(false);
        if (data.status !== 'success'){
          setLoading(false);
          setError(data.message)
        } 

        setFormData({
            username: '',
            phone: 0,
            government: '',
            city: '',
            streetAndAppartmentNo: '',
            products:[]
          });

        const handleClearCart = () => {
            dispatch(clearCart());
        }
          handleClearCart();

          console.log(data)

    } catch (error) {
        console.log(error)
    }
  }
  console.log(orderedData)

  return (
    <div>
        <div>
           { console.log(orderedData)}
            { orderedData.data?.order? ( 
                <div className='bg-orange-200 w-[96vw] flex flex-col items-end mx-auto px-[2vw] py-[1vw] rounded-lg gap-1'>
                    <p>
                      {orderedData.data.order.username}
                      <span className='ml-1'>:الإسم</span>
                    </p>
                    <p>
                      {orderedData.data.order.phone}
                      <span className='ml-1'>:رقم الهاتف</span>
                    </p>
                    <p>
                      {orderedData.data.order.government}
                      <span className='ml-1'>:المحافظة</span>
                    </p>
                    <p>
                      {orderedData.data.order.city}
                      <span className='ml-1'>:المدينة</span>
                    </p>
                    <p>
                      {orderedData.data.order.streetAndAppartmentNo}
                      <span className='ml-1'>:العنوان</span>
                    </p>
                    {orderedData.data.order.products.map(el =>(
                      <div key={el.product} className='flex flex-col items-end '>
                        <p>{el.name}</p>
                        <div className='flex flex-col items-end mr-3'>
                          <p>
                            {el.quantity}
                            <span className='ml-1'>:عدد</span>
                          </p>
                          <p>
                            {el.totalPrice}
                            <span className='ml-1'>:السعر</span>
                          </p>
                        </div>
                      </div>
                    ))}
                    <p>
                      {orderedData.data.order.totalPrice}
                      <span className='ml-1'>:الإجمالي</span>
                    </p>
                </div>
                ) : (
                  <form 
                    className='flex flex-col w-96 mx-auto gap-1 mt-1'
                    onSubmit={handleSubmit}
                  >
                    <input 
                      type='text' 
                      placeholder='ما اسمك؟'
                      className='border p-3 rounded-lg focus:outline-none' 
                      id='username' 
                      onChange={handleChange} 
                      value={formData.username}
                    />
                    <input 
                      type='number' 
                      placeholder='رقم الهاتف'
                      className='border p-3 rounded-lg focus:outline-none' 
                      id='phone' 
                      onChange={handleChange} 
                      value={formData.phone}
                    />
                    <input 
                      type='text' 
                      placeholder='الماحافظة'
                      className='border p-3 rounded-lg focus:outline-none' 
                      id='government' 
                      onChange={handleChange} 
                      value={formData.government}
                    />
                    <input 
                      type='text' 
                      placeholder='المدينة'
                      className='border p-3 rounded-lg focus:outline-none' 
                      id='city' 
                      onChange={handleChange} 
                      value={formData.city}
                    />
                    <input 
                      type='text' 
                      placeholder='العنوان بالتفصيل'
                      className='border p-3 rounded-lg focus:outline-none' 
                      id='streetAndAppartmentNo' 
                      onChange={handleChange} 
                      value={formData.streetAndAppartmentNo}
                    />
                    <button 
                      disabled={loading}
                      className='bg-orange-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                    >
                    {loading ? 'انتظر...' : 'إستكمال الطلب'}
                    </button>
                  </form>
                )
            }
            
        </div>
    </div>
  )
}
