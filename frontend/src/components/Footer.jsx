import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

     
      <div>
        <img src={assets.logo} className='mb-5 w-32' alt="logo" />
        <p className='w-full md:w-2/3 text-gray-600'>
          We are committed to providing our customers with the best shopping experience. 
          Our team is dedicated to offering high-quality products, excellent customer service, 
          and a seamless online shopping experience. We value your feedback and strive to 
          continuously improve our services to meet your needs.
        </p>
      </div>

     
      <div>
        <p className='text-xl font-medium mb-5'>COMPANY</p>
        <ul className='flex flex-col gap-1 text-gray-600'>
          <li className='hover:text-black cursor-pointer'>Home</li>
          <li className='hover:text-black cursor-pointer'>About us</li>
          <li className='hover:text-black cursor-pointer'>Delivery</li>
          <li className='hover:text-black cursor-pointer'>Privacy policy</li>
        </ul>
      </div>

      
      <div>
        <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>   
        <ul className='flex flex-col gap-1 text-gray-600'>
          <li>Email: info@company.com</li>
          <li>Phone: (123) 456-7890</li>
        </ul>
      </div>

      
      <div className='col-span-full'>
        <hr className='border-gray-300'/>
        <p className='py-5 text-sm text-center text-gray-500'>
          Copyright 2026 © forever.com - All Rights Reserved.
        </p>
      </div>

    </div>
  );
}

export default Footer;