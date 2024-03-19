import { useEffect, useState } from 'react'

export default function ShowOrder() {
  const [orders, setOrders] = useState();

  useEffect(()=>{
    const fetchOrders = async () => {
      try {
        const res = await fetch('api/v1/order')
        const data = await res.json()
        setOrders(data.data.order)
        console.log(data.data.order)
      } catch (err) {
        console.log(err)
      }
    }

    fetchOrders();
  },[])

  return (
    <div className='flex flex-col sm:flex-row sm:flex-wrap justify-evenly gap-4 sm:mx-auto mx-5 mt-5'>
      {orders?.map(order => 
      <div 
        key={order._id}
        className='bg-orange-200 flex flex-col items-end h-fit p-2 text-right'
      >
        <h2 className='text-right flex'>
          {order.username} <span>:الإسم</span>
        </h2>
        <p className='flex text-red-500'>
          {order.phone} <span className='ml-1'>:رقم الهاتف</span>
        </p>
        <p className='flex'>
          {order.government} <span>:المحافظة</span>
        </p>
        <p className='flex'>
          {order.city} <span>:مدينة</span>
        </p>
        <p className='flex'>
          {order.streetAndAppartmentNo} <span>:العنوان بالتفصيل</span>
        </p>
        <div className='flex flex-col'>
          <span>:المشتريات</span>
          {order.products.map((product) =>
          <div 
            key={product._id}
            className='flex flex-col gap-2 text-right m-3 pr-2 border-r-2 border-r-orange-500'
          >
            <p>
              {product.name} <span>:اسم المنتج</span>
            </p>
            {
              product.product.discountedPrice
                ? <p className='text-red-500'>
                  {product.product.discountedPrice} <span>:السعر</span>
                </p> 
                : <p>
                  {product.product.regularPrice} <span>:السعر</span>
                </p>
            }
            <p>
              {product.quantity} <span>:عدد</span>
            </p>
            <p>
              {product.totalPrice} <span>:المجموع</span>
            </p>
          </div>
          )} 
        </div>
        <p className='flex font-bold'>
          {order.totalPrice} <span>:الإجمالي</span>
        </p>
      </div>)}
    </div>
  )
}
