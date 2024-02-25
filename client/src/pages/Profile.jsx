import { useSelector } from "react-redux";
import { useState } from "react";

import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutStart,
  logoutFailure,
  logoutSuccess
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: 0,
    country: 'مصر',
    government: '',
    city: '',
    streetAndAppartmentNo: '',
  });


  const handleChange =  (e) => {
    if (formData.username === currentUser.username) {
      setFormData({ ...formData, username: currentUser.username});      
    }

    if (formData.email === currentUser.email) {
      setFormData({ ...formData, email: currentUser.email });
    }
    if (e.target.id === 'phone') {
      setFormData({
        ...formData,
        phone: parseInt(e.target.value)
        
      })
    }else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
       const res = await fetch(`/api/v1/user/updateMe`,{
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.status !== 'success') {
        dispatch(updateUserFailure(data.message));
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/v1/user/${currentUser.data.user._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.status !== 'success') {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  }

  const handleLogout = async () => {
    try {
      dispatch(logoutStart());
      const res = await fetch('/api/v1/auth/logout')
      const data = await res.json();
      if (data.success === false) {
        dispatch(logoutFailure(data.message));
        return;
      }
      dispatch(logoutSuccess(data));
    } catch (err) {
      dispatch(logoutFailure(err.message));
    }
  }

  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-orange-400 text-3xl text-center my-7">
        {`${currentUser.data ?.user.username} مرحباً`}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="إسم المستخدم"
          id="username"
          defaultValue={currentUser.data?.user.username}
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          id="email"
          defaultValue={currentUser.data?.user.email}
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="tel"
          placeholder="رقم الهاتف"
          id="phone"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
          pattern="[0-9]*"
        />
        <input
          type="country"
          placeholder="مصر"
          id="country"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
          disabled
        />
        <input
          type="government"
          placeholder="المحافظة"
          id="government"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="city"
          placeholder="المدينة"
          id="city"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="streetAndAppartmentNo"
          placeholder="اسم الشارع ورقم العمارة والشقة"
          id="streetAndAppartmentNo"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-orange-600 text-white rounded-lg p-3 font-bold uppercase hover:opacity-95 disdabled:opacity-95"
        >
          {loading ? '...انتظر' : 'تحديث؟'}
        </button>
      </form>
      <div className="flex justify-between mt-5 w-fit mx-auto">
        {currentUser.data.user.role === 'admin' ? '' :<span 
          onClick={handleDeleteUser} 
          className="text-red-700 cursor-pointer"
        >
          احذف الحساب؟
        </span>}
        <span
          onClick={handleLogout} 
          className="text-red-700 cursor-pointer"
        >
          تسجيل الخروج؟
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error.message : ''}</p>
      <p className="text-green-700 mt-5 mx-auto w-fit">
        {updateSuccess ? 'تم التحديث بنجاح' : ''}
      </p>
    </div>
  )
}