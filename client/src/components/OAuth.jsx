import { GoogleAuthProvider, getAuth, signInWithPopup } from '@firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa"

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/v1/auth/google', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: result.user.displayName, 
          email: result.user.email,
          imageUrl: result.user.photoURL,
        })
      })
      const data = await res.json();
      console.log(data)
      dispatch(loginSuccess(data));
      navigate('/'); 
    } catch (err) { 
      console.error('Error during sign-in:', err);
      console.log('could not sign in with this account', err)
    }
  }
  return (
    <button 
      type='button'
      onClick={handleGoogleClick}
      className="bg-yellow-500 text-white p-3 flex justify-center items-center rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
    >
      <FaGoogle />
      <span className="mx-1">سجل بواسطة</span>
    </button>
  )
}