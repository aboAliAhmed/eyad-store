import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Offers from './pages/Offers';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Products' element={<Products/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact-us' element={<ContactUs/>}/>
        <Route path='/offers' element={<Offers/>}/>
        <Route path='/Dahboard' element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}