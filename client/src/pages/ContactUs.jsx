import { useState } from "react";
import { FaCopy, FaInstagram, FaShoppingCart, FaWhatsapp } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

export default function ContactUs() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center">
      {copied && (
        <p className='fixed  z-10 mx-auto top-[10vh] rounded-md bg-slate-100 p-2'>
          تم نسخ الرقم إلى الحافظة
        </p>
      )}
      <div className="flex flex-col w-fit ml-[10vw] gap-[5vh] text-3xl mt-8">
        <a 
          href="https://www.facebook.com/edo.alashry" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex justify-between items-center gap-2"
        >
          <FaFacebook className="text-[#0866ff] cursor" />
          <p>إياد العشري</p>
        </a>
        <a 
          href="https://www.facebook.com/edo.alashry" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex justify-between items-center gap-2"
        >
          <FaInstagram className="text-[#fe286d]" />
          <p>إياد العشري</p>
        </a>
        <div className="flex justify-between items-center gap-2">
          <FaWhatsapp className="text-green-500"  />
          <p>01010843039</p>
          <FaCopy
            className='text-slate-500 text-sm mb-5'
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          />
        </div>
        <div className="flex justify-between items-center gap-2">
          <FaWhatsapp className="text-green-500"  />
          <p>01150358811</p>
          <FaCopy
            className='text-slate-500 text-sm mb-5'
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          />
        </div>
      </div>
    </div>
  )
}
