import { useNavigate } from 'react-router-dom'
import { ShopContext } from './shopContext'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const USER_TOKEN_KEY = 'userToken';

const ShopContextProvider = (props) => {

    const currency = '$'
    const delivery_fee = 10
    const[search,setSearch]=useState('');
    const[showSearch,setShowSearch]=useState(false);
    const[cartitems,setCartItems]=useState({});
    const[products,setProducts]=useState([]);
    const[token,setToken]=useState(localStorage.getItem(USER_TOKEN_KEY) || '');
    const navigate=useNavigate();

    const backendUrl = String(import.meta.env.VITE_BACKEND_URL || '')
        .trim()
        .replace(/^['"]|['"]$/g, '')
        .replace(/\/+$/, '');

    const normalizeProduct = (item) => ({
        ...item,
        image: Array.isArray(item?.image) ? item.image.filter(Boolean) : (item?.image ? [item.image] : []),
        bestseller: Boolean(item?.bestseller ?? item?.bestSeller ?? false),
        date: Number(item?.date || 0),
    });

    const loadProducts = useCallback(async ()=>{
        if(!backendUrl) return;
        try {
            const res = await fetch(`${backendUrl}/api/product/list`, { cache: 'no-store' });
            const data = await res.json();
            if(data.success && Array.isArray(data.products)){
                setProducts(data.products.map(normalizeProduct));
            }
        } catch (error) {
            console.log(error);
        }
    },[backendUrl]);

    useEffect(()=>{
        loadProducts();

        const handleFocus = () => {
            loadProducts();
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadProducts();
            }
        };

        const intervalId = setInterval(() => {
            if (!document.hidden) {
                loadProducts();
            }
        }, 5000);

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    },[loadProducts]);

    useEffect(() => {
        if (token) {
            localStorage.setItem(USER_TOKEN_KEY, token);
        } else {
            localStorage.removeItem(USER_TOKEN_KEY);
        }
    }, [token]);

    const addToCart = async(itemId,size)=>{

     if(!size){
        toast.error("Please select a size");
        return;
     }



        let cartData =structuredClone(cartitems);

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);
    }

    const clearCart = () => {
        setCartItems({});
    }

   

const getCartCount = ()=>{
    let totalCount = 0;

    for(const items in cartitems){
        for(const item in  cartitems[items]){
           try {
            if(cartitems[items][item]>0){
                totalCount += cartitems[items][item];
            }

           } catch (error) {
            console.log(error);
            
           } 
        }

        
    }
    return totalCount;
}

    const updateQuantity = (itemId, size, quantity) => {
        const cartData = structuredClone(cartitems);

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        cartData[itemId][size] = quantity;
        setCartItems(cartData);
    }

    const getCartAmount = () => {
      let totalAmount=0;
      for(const items in cartitems){
        let itemInfo = products.find((product)=> String(product._id) === String(items));

        for(const item in cartitems[items]){
            try {
                if(cartitems[items][item]>0 && itemInfo){
                    totalAmount += cartitems[items][item] * itemInfo.price;
                }
            } catch (error) {
                console.log(error);
            }
        }

      }
        return totalAmount;
  }







 


    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartitems,
        setCartItems,
        addToCart,
        clearCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        loadProducts,
        backendUrl,
        token,
        setToken


    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider