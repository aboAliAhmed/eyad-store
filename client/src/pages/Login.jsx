import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

export default function Login() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData, 
      [e.target.id]:e.target.value,
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      dispatch(loginStart());
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.status !== 'success') {
        dispatch(loginFailure(data.message))
        return;
      }
      dispatch(loginSuccess(data));
      navigate('/')
    } catch (err) {
      dispatch(loginFailure(err.message))
    }
  }; 

  return (
    <div
      className='p-3 max-w-lg mx-auto w-fit'
    >
      <h1 className='text-orange-500 text-3xl text-center font-semibold my-7'>تسجيل الدخول</h1>
      <form 
        className='flex flex-col gap-4 w-80 m-auto'
        onSubmit={handleSubmit}
      >
        <input 
          type='email' 
          placeholder='email'
          className='border p-3 rounded-lg focus:outline-none' 
          id='email' 
          onChange={handleChange} 
        />
        <input 
          type='password' 
          placeholder='password'
          className='border p-3 rounded-lg focus:outline-none' 
          id='password' 
          onChange={handleChange} />
        <button 
          disabled={loading}
          className='bg-orange-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'تحميل...' : 'تسجيل الدخول؟'}
        </button>
        <OAuth />
      </form> 
      <div className='flex gap-2 w-fit mt-5 mx-auto'>
        <Link to={'/sign-up'}>
          <span className='text-orange-500'>أنشئ حساباً</span>
        </Link>
        <p className='text-orange-950'>ليس لديك حساباً؟</p>
      </div>
      {error && <p className='text-red-500 w-fit mt-5 m-auto'>{error}</p>}
    </div>
  )
}