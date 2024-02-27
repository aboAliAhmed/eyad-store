import { useEffect, useRef, useState } from "react"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";
export default function Listing() {
  const fileRef = useRef(null); // To reference the file input element.
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    imageURL: '',
    name: '',
    type: '',
    description: '',
    regularPrice: 0,
    customizedOffer: '',
    offer: false,
    discountedPrice: 0
  });

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
      case 'customizedOffer':
        setFormData({...formData, customizedOffer: e.target.value})
        break;
      case 'discountPrice':
        setFormData({...formData, discountedPrice: e.target.value})
        break;
    }
  }

  useEffect(()=>{
    if(file) {
      handleFileUpload();
    }
  }, [file])

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
      console.log(uploadTask.snapshot.ref)
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=> {setFormData({...formData, imageURL:downloadURL})
    }
      ).catch((error) => {
        // Handle any errors while getting the download URL
        console.error('Error getting download URL:', error);
      });
    })
  }
  console.log(formData)

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      setLoading(true);
      setError(false);
      const res = await fetch('/api/v1/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data)
      setLoading(false);
      if (data.status !== 'success'){
        setError(data.message)
      }
    }catch (err) {
      setError(err.message);
      setLoading()
    }
  }
  
  return (
    <main className="">
      <div className="grid bg-yellow-100 rounded-md w-fit my-3 m-auto">
        <h2 className="w-fit h-fit mt-3 m-auto py-2 rounded-lg">إضافة منتج</h2>
        <form className="m-auto p-2" onSubmit={handleSubmit}>
          <div className="sm:flex sm:justify-evenly items-center max-w-2xl">
            <div>
              <div className='flex items-center my-2 gap-2'>
                <input 
                  type="text" 
                  placeholder='إسم المنتج' 
                  className='border rounded-lg pl-1 py-3 focus:outline-none' 
                  id='name' 
                  required
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
                  required
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
                  required
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
                  id='discountPrice' 
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                  <span>تخفيض</span>
              </div>
              <div className='flex items-center my-2 gap-2'>
                <input 
                  type="text" 
                  placeholder='تحديد عرض' 
                  className='border rounded-lg pl-1 py-3  focus:outline-none' 
                  id='customizedOffer' 
                  onChange={handleChange}
                  value={formData.customizedOffer}
                />
                <span>تحديد عرض</span>
              </div>
            </div>
            <div className="mx-auto grid justify-center">
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
                onClick={() => fileRef.current.click()}
                className='bg-amber-500 text-white w-60 rounded m-auto py-2 mb-1 hover:opacity-90'
              >إضافة صورة</button>
              {imageUploadError 
                ? (<span className="text-red-500">حدثت مشكلة أثناء تحميل الصورة</span>) 
                : filePerc > 0 && filePerc < 100 
                ? (<span className="text-orange-500">انتظر</span>)  
                : filePerc === 100 
                ? (<span className="text-green-500 w-fit m-auto">تم تحميل الصورة</span> )
              : ('')}
            </div>
          </div>
          <button 
            className="bg-orange-600 text-white w-11/12 text-xl focus:outline-none rounded p-2 m-auto"
          >إضافة منتج</button>
        </form>
      </div>
    </main>
  )
}
 