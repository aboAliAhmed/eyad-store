import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import ProductItem from "../components/ProductItem";

export default function SearchResults() {
  
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(false); 
  const [ products, setProducts ] = useState([]); 
  const [ showMore, setShowMore ] = useState([]); 
  const [sidebarData, setSidebarDate] = useState({
    searchTerm: '',
    type: '',
    offer: false,
    sort: 'created-at',
    order: 'desc'
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    // if there are search parameter update sidebarData
    if (
      searchTermFromUrl ||
      typeFromUrl || 
      offerFromUrl !== null || 
      sortFromUrl ||
      orderFromUrl 
    ) {
      setSidebarDate({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || '',
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created-at',
        order: orderFromUrl || 'desc'
      })
    }

    const fetchProducts = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/v1/product?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setProducts(data.data.product);
      setLoading(false);
    } 

    fetchProducts();
  }, [location.search])

  const handleChange = (e) => {
    if (e.target.id === 'type'){
      setSidebarDate({...sidebarData, type: e.target.value});
    }

    if (e.target.id === 'searchTerm'){
      setSidebarDate({...sidebarData, searchTerm: e.target.value});
    }

    if (
      e.target.id === 'offer'
    ){
      setSidebarDate({...sidebarData, offer: e.target.checked || e.target.checked === 'true' ? true : false});
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created-at';
      const order = e.target.value.split('_')[1] || 'desc';

      setSidebarDate({ ...sidebarData, sort, order});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }

  const onShowMoreClick = async () => {
    const startIndex = products.length; // number of products
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`api/v1/listing?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setProducts(...products, ...data)
  }
  return (
    
    <div className='flex flex-col sm:flex-row-reverse pt-20'>
        <form onSubmit={handleSubmit} className='bg-fuchsia-100 flex flex-col w-5/6 sm:w-80 h-fit mx-auto mt-4 p-2 gap-5'>
          <div className='flex items-center gap-2'>
            <input 
              type="text" 
              id='searchTerm' 
              placeholder='...عما تبحث' 
              className='border rounded-lg p-3 w-full focus:outline-none' 
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
            <label className='whitespace-nowrap font-semibold'>:البحث عن</label>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <div className='flex items-center w-1/4 gap-2'>
              <input 
                type="checkbox" 
                id='offer'  
                className='w-full h-6 focus:outline-none'
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>عروض</span>
            </div>
            <div className='flex items-center w-3/4 gap-2'>
              <input 
                type="text" 
                id='type'  
                className='w-full h-9 rounded-lg focus:outline-none'
                onChange={handleChange}
                checked={sidebarData.type}
              />
              <span>قسم</span>
            </div>
          </div>
          <div className='flex justify-center items-center gap-2'>
            <select 
              id="sort_order" 
              className='border bg-fuchsia-200 rounded-lg p-3'
              onChange={handleChange}
              defaultValue={'created_at_desc'}
            >
              <option value='createdAt_desc'>الأحدث</option>
              <option value='regularPrice_asc'>الأرخص سعراً</option>
              <option value='regularPrice_desc'>الأغلى سعراً</option>
            <option value='createdAt_asc'>الأقدم</option>
            </select>
            <label className='font-semibold'>:الترتيب</label>
          </div>
          <button 
            className='bg-[#3d2646] text-white p-3 rounded-lg uppercase hover:opacity-95'
          >تم</button>
        </form>
      <div className='flex-1'>
        <h1 className='text-orange-900/90 text-3xl font-semibold mt-5 border-b p-3 text-center border-orange-200'> 
          :القائمة
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && products.length === 0 && (
            <p className="text-red-600 text-3xl font-bold m-auto">لا توجد متجات بهذه المواصفات</p>
          )}
          {loading && (
            <p className="text-xl text-orange-500 text-center w-full">...انتظر</p>
          )}
          {!loading && products && products.map((product) =>(<ProductItem key={product._id} product={product}/>))}
          {showMore && (
            <button 
              onClick={onShowMoreClick}
              className="text-green-700 hover:underine p-7 text-center w-full"
            >
              عرض المزيد
            </button>
          )}
        </div>
      </div>
    </div>
  )
}