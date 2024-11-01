import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ErrorComponent from '../components/ErrorComponent';
import { FaEdit, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { addToCart, decreaseQuantity } from "../redux/cart/cartSlice";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function Product() {

  const { currentUser } = useSelector((state) => state.user);
  const cart = useSelector((state)=>state.cart.cart);
  const fileRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({offer: false, discountedPrice: ''});

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

  useEffect(()=>{
    if(file) {
      handleFileUpload();
    }
  }, [file])
  
  const handleDeleteProduct = async () => {
    try {
      const res = await fetch(`/api/v1/product/${product._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.status !== 'success') {
        return;
      }
    } catch (err) {
     console.log(err);
    }
  }
  
  const handleChange = (e) =>{
    switch (e.target.id) {
      case 'name':
        setFormData({...formData, name: e.target.value})
        break;
      case 'type':
        setFormData({...formData, type: e.target.value})
        break;
      case 'regularPrice':
        setFormData({...formData, regularPrice: e.target.value})
        break;
      case 'description':
        setFormData({...formData, description: e.target.value})
        break;
      case 'offer':
        setFormData({...formData, offer: e.target.checked})
        break;
      case 'discountedPrice':
        setFormData({...formData, discountedPrice: e.target.value})
        break;
    }
  }

  const handleFileUpload = () => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    //track the changes
    uploadTask.on('state_changed', (snapShot)=>{
      const progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
      setFilePerc(Math.round(progress))
    }, (error) => {
      setImageUploadError(true)
      console.error(error);
    }, ()=>{
      // get teh download url
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=> {setFormData({...formData, imageURL:downloadURL})
    }
      ).catch((error) => {
        // Handle any errors while getting the download URL
        console.error('Error getting download URL:', error);
      });
    })
  }


  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/v1/product/${product._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.status !== 'success'){
        setLoading(false);
        setError(data.message)
      } 

      setFormData({
        imageURL: '',
        name: '',
        type: '',
        description: '',
        regularPrice: '',
        offer: false,
        discountedPrice: ''
      });
      setFile(undefined);

    }catch (err) {
      setError(err.message);
      setLoading()
    }
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  }

  const handleDecreaseQuantity = (product) => {
    dispatch(decreaseQuantity(product));
  }

  return (
    <main className='w-full flex flex-col p-[4%]'>
      {loading && <p className='text-center mt-7 text-2xl'>...انتظر</p>}
      {error && (<ErrorComponent />)}

      {currentUser?.data?.user.role === 'admin' 
        ?<button onClick={() => handleDeleteProduct()}>
          <FaTimes className="text-red-500 text-2xl mx-auto" />
        </button>
        : ''
      }
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
                      {product.discountedPrice.toLocaleString('en-US')} 
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
                    {product.regularPrice?.toLocaleString('en-US')}
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
            className="bg-[#8e61a0] text-white flex justify-center items-center w-[96%] mx-auto py-[3%] px-6 rounded-lg"
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
              className="bg-[#8e61a0] text-white flex justify-center items-center w-1/3 rounded-lg p-2"
            >
              <FaMinus />
            </button>
            <span
              className="text-orange-900"
              >{cart.find(item => item._id === product._id).orderedQuantity}</span>
            <button 
              onClick={()=> handleAddToCart(product)}
              className="bg-[#8e61a0] text-white flex justify-center items-center w-1/3 rounded-lg p-2" 
            >
              <FaPlus />
            </button>
            </div> ) 
            : ''
            }
          </div>
        </div>
      )} 
      {currentUser?.data?.user.role === 'admin' 
      ? <form 
        className="bg-purple-100 flex flex-col items-center my-10 p-2" 
        onSubmit={handleSubmit}
      >
        <h2 className='w-fit text-red-600 text-3xl mx-auto mb-8 p-2 rounded-lg'>تعديل المنتج</h2>
        <div className="sm:flex sm:justify-evenly items-center max-w-2xl">
          <div className='my-4'>
            <div className='flex items-center my-2 gap-2'>
              <input 
                type="text" 
                placeholder='إسم المنتج' 
                className='border rounded-lg pl-1 py-3 focus:outline-none' 
                id='name' 
                onChange={handleChange}
                value={formData.name}
              />
              <span>إسم المنتج</span>
            </div>
            <div className='flex items-center my-2 gap-2'>
              <input 
                type="text" 
                placeholder='نوع المنتج' 
                className='border rounded-lg pl-1 py-3 focus:outline-none' 
                id='type' 
                onChange={handleChange}
                value={formData.type}
              />
              <span>نوع المنتج</span>
            </div>
            <div className='flex items-center my-2 gap-2'>
              <input 
                type="number" 
                placeholder='سعر المنتج' 
                className='border rounded-lg pl-1 py-3 focus:outline-none' 
                id='regularPrice' 
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <span>سعر المنتج</span>
            </div>
            <div className='flex items-center my-2 gap-2'>
              <textarea 
                type="text" 
                placeholder='الوصف' 
                className='border rounded-lg pl-1 py-3 w-64 focus:outline-none' 
                id='description' 
                onChange={handleChange}
                value={formData.description}
              />
              <span>الوصف</span>
            </div>
            <div className='flex items-center my-2 gap-2'>
              <input 
                type="checkbox" 
                placeholder='عرض' 
                className='border p-3 rounded-lg pl-1 py-3 w-5 h-5 m-1' 
                id='offer' 
                onChange={handleChange}
                value={formData.offer}
              />
                <span>عرض</span>
            </div>
            <div className='flex items-center my-2 gap-2'>
              <input 
                type="number" 
                placeholder='تخفيض' 
                className='border rounded-lg pl-1 py-3  focus:outline-none'  
                id='discountedPrice' 
                onChange={handleChange}
                value={formData.discountedPrice}
              />
                <span>تخفيض</span>
            </div>
          </div>
          <div className="ml-1 grid justify-center">
            {formData.imageURL ?(<img 
              src={formData.imageURL} 
              alt="صورة المنتج" 
              className="w-60 h-60 m-1 rounded"
            />) : ('')}
            <input 
              onChange={(e)=>setFile(e.target.files[0])}
              className='hidden'
              type="file"
              ref={fileRef}
              id='image'
              accept='image/*'
            />
            <button 
              type='button' //so as not to submit the parent form
              disabled={loading}
              onClick={() => fileRef.current.click()}
              className='bg-fuchsia-800 text-white w-60 rounded m-auto py-2 mb-1 hover:opacity-90'
            >إضافة صورة</button>
            {imageUploadError 
              ? (<span className="text-red-500">حدثت مشكلة أثناء تحميل الصورة</span>) 
              : filePerc > 0 && filePerc < 100 
              ? (<span className="text-orange-500">انتظر</span>)  
              : filePerc === 100 
              ? (<span className="text-green-500 w-fit m-auto">تم تحميل الصورة</span> )
              : ('')
            }
          </div>
        </div>
        <button 
          className="bg-purple-800 text-white w-11/12 text-xl focus:outline-none rounded p-2 m-auto"
        >
          تعديل المنتج
        </button>
      </form> :'' }
    </main>
  )
}
 