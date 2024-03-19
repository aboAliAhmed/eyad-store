import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Offers from './pages/Offers';
import CreateProduct from './pages/CreateProduct';
import Products from './pages/Products';
import Profile from './pages/Profile';
import ShoppingCart from './pages/ShoppingCart';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import AdminOnly from './components/AdminOnly';
import Search from './pages/Search';
import Product from './pages/ProductPage';
import Address from './pages/Address';
import ShowOrder from './pages/ShowOrder';

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/offers' element={<Offers/>}/>
        <Route path='/shopping-cart' element={<ShoppingCart/>}/>
        <Route path='/adress' element={<Address/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact-us' element={<ContactUs/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/sign-in' element={<Login/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/product/:productId' element={<Product />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
        <Route element={<AdminOnly />}>
          <Route path='/create-product' element={<CreateProduct/>} />
          <Route path='/show-orders' element={<ShowOrder/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}