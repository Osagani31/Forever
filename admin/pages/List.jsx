import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ADMIN_TOKEN_KEY, backendUrl } from '../src/config';

const List = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState('');

  const getAuthToken = () =>
    String(token || localStorage.getItem(ADMIN_TOKEN_KEY) || '')
      .trim()
      .replace(/^["']|["']$/g, '');

  const fetchProducts = useCallback(async () => {
    if (!backendUrl) {
      toast.error('Missing VITE_BACKEND_URL in admin .env');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/product/list`, {
        method: 'GET',
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success && Array.isArray(data?.products)) {
        setProducts(data.products);
      } else {
        toast.error(data?.message || 'Failed to load products');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeProduct = async (id) => {
    const authToken = getAuthToken();
    if (!authToken) {
      toast.error('Not logged in. Please sign in again.');
      return;
    }

    try {
      setRemovingId(String(id));
      const res = await fetch(`${backendUrl}/api/product/${id}`, {
        method: 'DELETE',
        headers: {
          token: authToken,
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        toast.success(data?.message || 'Product removed successfully');
        setProducts((prev) => prev.filter((item) => String(item?._id) !== String(id)));
      } else {
        toast.error(data?.message || 'Failed to remove product');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to remove product');
    } finally {
      setRemovingId('');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className='w-full'>
      <p className='mb-4 text-lg font-medium'>All Products List</p>

      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[80px_2fr_1fr_1fr_80px] items-center py-2 px-3 border border-gray-200 bg-gray-50 text-sm font-medium'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {loading ? (
          <div className='py-6 px-3 border border-gray-200 text-sm text-gray-500'>Loading products...</div>
        ) : products.length === 0 ? (
          <div className='py-6 px-3 border border-gray-200 text-sm text-gray-500'>No products found.</div>
        ) : (
          products.map((item) => {
            const imageSrc = Array.isArray(item?.image) ? item.image[0] : item?.image;
            return (
              <div
                key={item?._id}
                className='grid grid-cols-[80px_1fr] md:grid-cols-[80px_2fr_1fr_1fr_80px] items-center gap-3 py-2 px-3 border border-gray-200 text-sm'
              >
                <img
                  src={imageSrc}
                  alt={item?.name || 'Product'}
                  className='w-12 h-12 object-cover rounded border border-gray-200'
                />

                <div className='flex flex-col md:block'>
                  <p className='font-medium text-gray-800'>{item?.name}</p>
                  <p className='md:hidden text-gray-500'>
                    {item?.category} | ${Number(item?.price || 0)}
                  </p>
                </div>

                <p className='hidden md:block'>{item?.category}</p>
                <p className='hidden md:block'>${Number(item?.price || 0)}</p>

                <button
                  type='button'
                  onClick={() => removeProduct(item?._id)}
                  disabled={removingId === String(item?._id)}
                  className='justify-self-start md:justify-self-center text-base text-gray-700 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
                  aria-label='Remove product'
                  title='Remove product'
                >
                  {removingId === String(item?._id) ? '...' : 'X'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default List;