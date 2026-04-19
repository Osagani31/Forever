import React, { useState } from 'react'
import Title from '../components/Title'
import Cart from './Cart'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { ShopContext } from '../context/shopContext'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method,setMethod]=useState('cod');
  const [placing, setPlacing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });
  const {navigate, cartitems, products, getCartAmount, delivery_fee, backendUrl, token, clearCart}=  useContext(ShopContext);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    const items = [];
    for (const productId in cartitems) {
      const product = products.find((p) => String(p._id) === String(productId));
      if (!product) continue;

      for (const size in cartitems[productId]) {
        const qty = Number(cartitems[productId][size] || 0);
        if (qty <= 0) continue;
        items.push({
          productId,
          name: product.name,
          price: product.price,
          image: Array.isArray(product.image) ? product.image[0] : product.image,
          size,
          quantity: qty,
        });
      }
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!backendUrl) {
      toast.error('Missing VITE_BACKEND_URL in frontend .env');
      return;
    }

    try {
      setPlacing(true);
      const res = await fetch(`${backendUrl}/api/order/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          address: formData,
          paymentMethod: method.toUpperCase(),
          amount: Number(getCartAmount() || 0) + delivery_fee,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        clearCart();
        toast.success('Order placed successfully');
        navigate('/orders');
      } else {
        toast.error(data?.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-gray-300'>
      {/* Left Section */}

     <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
      <div className='text-xl sm:text-2xl my-3'>
         <Title text1={'DELIVERY'} text2={'INFORMATION'} />
      </div>
      <div className='flex gap-3'>
        <input name='firstName' value={formData.firstName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' required />
        <input name='lastName' value={formData.lastName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' required />
      </div>
         <input name='email' value={formData.email} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' required />
          <input name='street' value={formData.street} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' required />
      <div className='flex gap-3'>
        <input name='city' value={formData.city} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' required />
        <input name='state' value={formData.state} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' required />
      </div>
      <div className='flex gap-3'>
        <input name='zipcode' value={formData.zipcode} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Zip Code' required />
        <input name='country' value={formData.country} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' required />
      </div>
       <input name='phone' value={formData.phone} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Phone Number' required />
     </div>

      {/* Right Section */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal/>
        </div>
      <div className='mt-12'>
        <Title text1={'PAYMENT'} text2={'METHOD'} />
         {/* Payment Method Selection */}
        <div className='flex gap-3 flex-col lg:flex-row'>
       <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
          <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod' ? 'bg-green-400' : ''}`}></p>
          <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
         </div>
        </div>
      <div className='w-full text-end mt-8'>
         <button type='submit' disabled={placing}
          className='bg-black text-white px-16 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed'>{placing ? 'PLACING...' : 'PLACE ORDER'}</button>
      </div>

      </div>
      </div>

    </form>
  )
}

export default PlaceOrder