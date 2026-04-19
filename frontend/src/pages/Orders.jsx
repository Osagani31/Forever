import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/shopContext'
import Title from '../components/Title';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const Orders = () => {

const{currency, backendUrl, token, navigate, clearCart} = useContext(ShopContext);
const location = useLocation();
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);

const fetchUserOrders = useCallback(async () => {
  if (!token) {
    setOrders([]);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    const res = await fetch(`${backendUrl}/api/order/user`, {
      method: 'GET',
      headers: {
        token,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.success && Array.isArray(data?.orders)) {
      setOrders(data.orders);
    } else {
      toast.error(data?.message || 'Failed to load orders');
    }
  } catch (error) {
    toast.error(error?.message || 'Failed to load orders');
  } finally {
    setLoading(false);
  }
}, [backendUrl, token]);

useEffect(() => {
  fetchUserOrders();
}, [fetchUserOrders]);



const trackOrder = async (order) => {
  try {
    const res = await fetch(`${backendUrl}/api/order/user`, {
      method: 'GET',
      headers: {
        token,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.success && Array.isArray(data?.orders)) {
      setOrders(data.orders);
      const latest = data.orders.find((item) => String(item?._id) === String(order?._id));
      toast.info(`Current status: ${(latest?.status || order?.status || 'Order Placed')}`);
    } else {
      toast.error(data?.message || 'Failed to track order');
    }
  } catch (error) {
    toast.error(error?.message || 'Failed to track order');
  }
};


  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {!token ? (
          <div className='py-4 border-b text-gray-600 flex items-center justify-between'>
            <p>Please login to view your orders.</p>
            <button onClick={()=>navigate('/login')} className='border border-gray-300 px-4 py-2 text-sm font-medium rounded-sm'>Login</button>
          </div>
        ) : loading ? (
          <div className='py-4 border-b text-gray-500'>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className='py-4 border-b text-gray-500'>No orders found.</div>
        ) : (
          orders.map((order)=>(
            <div key={order._id} className='py-4 border-b text-gray-700 flex flex-col gap-4'>
              {Array.isArray(order?.items) && order.items.map((item, idx)=>(
                <div key={`${order._id}-${idx}`} className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                  <div className='flex items-start gap-6 text-sm'>
                    <img className='w-16 sm:w-20' src={item?.image} alt={item?.name || 'Order item'}/>
                    <div>
                      <p className='sm:text-base font-medium'>{item?.name}</p>
                      <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                        <p className='text-lg'>{currency}{Number(item?.price || 0).toFixed(2)}</p>
                        <p>Quantity: {Number(item?.quantity || 0)}</p>
                        <p>Size: {item?.size}</p>
                      </div>
                      <p>Date: <span className='text-gray-400'>{order?.date ? new Date(order.date).toDateString() : '-'}</span></p>
                      <p>Payment: <span className={`font-medium ${order?.payment ? 'text-green-600' : 'text-gray-400'}`}>{order?.payment ? 'Paid' : order?.paymentMethod}</span></p>
                    </div>
                  </div>

                  <div className='md:w-1/2 flex justify-between'>
                    <div className='flex items-center gap-2'>
                      <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                      <p className='text-sm md:text-base'>{order?.status || 'Order Placed'}</p>
                    </div>
                    <button onClick={()=>trackOrder(order)} className='border border-gray-300 px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default Orders