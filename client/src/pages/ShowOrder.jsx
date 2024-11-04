import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function ShowOrder() {
  const [orders, setOrders] = useState();
  const user = useSelector((state) => state.user.currentUser);

  useEffect(()=>{
    const fetchOrders = async () => {
      try {
        console.log(user.token)

        const res = await fetch('api/v1/order', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json()
        setOrders(data.data.order)

      } catch (err) {
        console.log(err)
      }
    }

    fetchOrders();

  },[])
  return (
    <div className='flex flex-col sm:flex-row sm:flex-wrap sm:justify-evenly gap-10 mx-5 sm:mx-10 pt-20'>
      {orders?.map((order, i) => 
        <div 
          key={order._id}
          className='bg-zinc-200 flex flex-col items-end w-[80vw] sm:w-96 h-fit mx-auto p-2 text-right border-2 border-t-8 border-zinc-600 rounded-lg'
        >
          <p className='w-full text-red-950 text-center text-lg'>{order.orderNumber}</p>
          <h2 className='text-right flex'>
            <span>{order.username}</span>
            <span className='ml-2'>: الإسم</span>
          </h2>
          <p className='flex text-red-950'>
            <span>{order.phone}</span>
            <span className='ml-1'>:رقم الهاتف</span>
          </p>
          <p className='flex'>
            <span>{order.government}</span>
            <span>:المحافظة</span>
          </p>
          <p className='flex'>
            <span>{order.city}</span>
            <span>:مدينة</span>
          </p>
          <p className='flex'>
            <span>{order.streetAndAppartmentNo}</span> 
            <span>:العنوان بالتفصيل</span>
          </p>
          <div className='flex flex-col mt-2'>
            <span className=''>:المشتريات</span>
            {order.products.map((product) =>
            <div 
              key={product._id}
              className='flex flex-col gap-2 text-right m-3 pr-2 border-r-2 border-r-orange-950'
            >
              <p className='flex flex-row-reverse gap-2 justify-start'>
                <span className=''>: اسم المنتج</span>
                <span>{product.name}</span>
              </p>
              <p>
                <span>{product.quantity} </span>
                <span>: عدد</span>
              </p>
              <p>
                <span>{product.totalPrice}</span>
                <span>: مجموع السعر</span>
              </p>
            </div>
            )} 
          </div>
          <p className='bg-zinc-300 text-red-950 flex font-bold m-2 w-fit mx-auto p-2 border-2 rounded-lg border-zinc-500'>
            <span>{order.totalPrice}</span>
            <span>:الإجمالي</span>
          </p>
        </div>
      )}
    </div>
  )
}
