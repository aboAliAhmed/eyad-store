import { useEffect, useState } from "react";
import ProductItem from "../components/ProductItem";

export default function Offers() {
  const [recentOffers, setRecentOffers] = useState([]);
  useEffect(()=>{
    const fetchRecentOffers = async () => { 
      try {
        const res = await fetch(`api/v1/product?offer=true&&sort=createdAt&order=desc`);
        const data = await res.json();
        setRecentOffers(data.data.product);
      } catch (err) {
        console.log(err);
      }
    }

    fetchRecentOffers();
  
  },[])
  return (
    <div>
      <div className='flex flex-wrap justify-between items-center gap-2'>
            {recentOffers && recentOffers.length > 0 && recentOffers.map((product) =>(<ProductItem key={product._id} product={product}/>))}
          </div>
    </div>
  )
}
