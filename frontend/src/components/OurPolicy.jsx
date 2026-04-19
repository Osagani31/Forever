import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
    <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5 ' alt="Exchange"/>
        <p className='font-semibold'>Easy Exchange Policy</p>
        <p className='text-gray-400'>We offer hassle free exchange policy</p>
    </div>
    
    <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5 ' alt="Quality"/>
        <p className='font-semibold'>7 Return Policy</p>
        <p className='text-gray-400'>We offer a 7-day return policy</p>
    </div>

    <div>
        <img src={assets.support_img} className='w-12 m-auto mb-5 ' alt="Exchange"/>
        <p className='font-semibold'>24/7 Customer Support</p>
        <p className='text-gray-400'>Our support team is available around the clock</p>
    </div>
    

    </div>
  )
}

export default OurPolicy