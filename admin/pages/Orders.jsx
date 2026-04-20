import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../src/assets/assets';
import { ADMIN_TOKEN_KEY, backendUrl } from '../src/config';

const statusOptions = [
  'Order Placed',
  'Packing',
  'Shipped',
  'Out for delivery',
  'Delivered',
];

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');

  const authToken = useMemo(
    () =>
      String(token || localStorage.getItem(ADMIN_TOKEN_KEY) || '')
        .trim()
        .replace(/^["']|["']$/g, ''),
    [token]
  );

  const fetchOrders = useCallback(async () => {
    if (!authToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/order/list`, {
        method: 'GET',
        headers: {
          token: authToken,
          Authorization: `Bearer ${authToken}`,
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
  }, [authToken]);

  const updateStatus = async (orderId, status) => {
    if (!authToken) {
      toast.error('Please login again');
      return;
    }

    try {
      setUpdatingId(String(orderId));
      const res = await fetch(`${backendUrl}/api/order/status/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: authToken,
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        setOrders((prev) => prev.map((o) => (String(o._id) === String(orderId) ? { ...o, status } : o)));
        toast.success('Order status updated');
      } else {
        toast.error(data?.message || 'Failed to update order status');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to update order status');
    } finally {
      setUpdatingId('');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  return (
    <div className='w-full'>
      <p className='mb-4 text-lg font-medium'>Order Page</p>

      {loading ? (
        <div className='py-6 border border-gray-200 px-4 text-gray-500'>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className='py-6 border border-gray-200 px-4 text-gray-500'>No orders found.</div>
      ) : (
        <div className='flex flex-col gap-4'>
          {orders.map((order) => (
            <div key={order._id} className='grid grid-cols-1 lg:grid-cols-[0.5fr_2fr_0.8fr_0.8fr_1fr] gap-4 border border-gray-200 p-4 text-sm'>
              <div>
                <img src={assets.parcel_icon} alt='Parcel' className='w-12' />
              </div>

              <div>
                <div className='text-gray-700'>
                  {(order?.items || []).map((item, idx) => (
                    <p key={`${order._id}-${idx}`}>
                      {item?.name} x {item?.quantity}, {item?.size}
                    </p>
                  ))}
                </div>

                <p className='mt-3 font-medium'>
                  {order?.address?.firstName} {order?.address?.lastName}
                </p>
                <div className='text-gray-500'>
                  <p>{order?.address?.street}</p>
                  <p>
                    {order?.address?.city}, {order?.address?.state}, {order?.address?.country}, {order?.address?.zipcode}
                  </p>
                  <p>{order?.address?.phone}</p>
                </div>
              </div>

              <div>
                <p>Items : {(order?.items || []).length}</p>
                <p>Method : {order?.paymentMethod}</p>
                <p>Payment : {order?.payment ? 'Done' : 'Pending'}</p>
                <p>Date : {order?.date ? new Date(order.date).toLocaleDateString() : '-'}</p>
              </div>

              <p className='text-base font-medium'>${Number(order?.amount || 0).toFixed(2)}</p>

              <select
                className='border border-gray-300 px-2 py-1 bg-white h-fit'
                value={order?.status || 'Order Placed'}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                disabled={updatingId === String(order?._id)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
