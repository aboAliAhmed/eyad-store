import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // to disable submit button when submitting
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData, 
      [e.target.id]:e.target.value,
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.status !== 'success') {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (err) {
      setLoading(false);
      setError(err.message);   
    }
  }; 

  return (
    <div
      className='p-3 max-w-lg mx-auto w-fit'
    >
      <h1 className='text-3xl text-orange-400 text-center font-semibold my-7'>إنشاء حساب</h1>
      <form 
        className='flex flex-col gap-4 w-80 m-auto'
        onSubmit={handleSubmit}
      >
        <input
          type='text' 
          placeholder='username'
          className='text-orange-950 border p-3 rounded-lg focus:outline-none' 
          id='username' 
          onChange={handleChange} 
        />
        <input 
          type='email' 
          placeholder='email'
          className='text-orange-950 border p-3 rounded-lg focus:outline-none' 
          id='email' 
          onChange={handleChange} 
        />
        <input 
          type='password' 
          placeholder='password'
          className='text-orange-950 border p-3 rounded-lg focus:outline-none' 
          id='password' 
          onChange={handleChange} />
        <button 
          disabled={loading}
          className='bg-orange-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'أنشئ حساباً'}
        </button>
        <OAuth />
      </form> 
      <div className='flex gap-2 mt-5 mx-auto w-fit'>
        <Link to={'/login'}>
          <span className='text-orange-700'>سجل الدخول</span>
        </Link>
        <p className='text-orange-950'>لديك حساباً؟</p>
      </div>
      {error && <p className='text-red-500 mt-5 mx-auto w-fit'>{error}</p>}
    </div>
  )
}