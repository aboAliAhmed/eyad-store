import errorImage from '../assets/images/gettyimages-182763102-612x612.jpg';

export default function ErrorComponent() {
  return (
    <div className='w-96 h-96 p-5 m-auto '>
        <img 
            src={errorImage} 
            alt="" 
            className='w-72 h-72 m-auto border-2 border-orange-600 rounded-lg '
        />
        <p className='text-orange-700 text-center my-7 text-2xl'>هناك مشكلة</p>
    </div>
  )
}
