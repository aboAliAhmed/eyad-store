import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Offers from './pages/Offers';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Profile from './pages/Profile';
import ShoppingCart from './pages/ShoppingCart';
import SignUp from './pages/Signup';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/shopping-cart' element={<ShoppingCart/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/sign-in' element={<Login/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact-us' element={<ContactUs/>}/>
        <Route path='/offers' element={<Offers/>}/>
        <Route path='/dahboard' element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}