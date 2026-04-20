import React, { useState } from 'react';
import { assets } from '../src/assets/assets';
import { toast } from 'react-toastify';
import { ADMIN_TOKEN_KEY } from '../src/config';

const rawBackend = import.meta.env.VITE_BACKEND_URL || "";
const backendUrl = String(rawBackend).trim().replace(/^['"]|['"]$/g, "").replace(/\/+$/, "");

const Add = ({ token }) => {

const [image1,setImage1]=useState(false)
const [image2,setImage2]=useState(false)
const [image3,setImage3]=useState(false)
const [image4,setImage4]=useState(false)

const[name,setName]=useState("");
const[description,setDescription]=useState("");
const[price,setPrice]=useState("");
const[category,setCategory]=useState("Men");
const[subCategory,setSubCategory]=useState("Top Wear");
const[bestSeller,setBestSeller]=useState(false);
const[sizes,setSizes]=useState([]);

const [submitting, setSubmitting] = useState(false);

const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (!image1 && !image2 && !image3 && !image4) {
    toast.error("Please upload at least one product image.");
    return;
  }

  if (sizes.length === 0) {
    toast.error("Please select at least one size.");
    return;
  }

  setSubmitting(true);

  try {
    const authToken = String(token || localStorage.getItem(ADMIN_TOKEN_KEY) || "")
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!authToken) {
      toast.error("Not logged in. Please sign in again.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();

    formData.append("token", authToken);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("bestseller", bestSeller ? "true" : "false");
    formData.append("sizes", JSON.stringify(sizes));

    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);
    if (image3) formData.append("image3", image3);
    if (image4) formData.append("image4", image4);

    if (!backendUrl) {
      toast.error("Missing VITE_BACKEND_URL in admin .env");
      setSubmitting(false);
      return;
    }

    const res = await fetch(`${backendUrl}/api/product/add`, {
      method: "POST",
      headers: {
        token: authToken,
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data?.success) {
      toast.success(data?.message || "Product added successfully");
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Men");
      setSubCategory("Top Wear");
      setBestSeller(false);
      setSizes([]);
      setImage1(false);
      setImage2(false);
      setImage3(false);
      setImage4(false);
    } else {
      toast.error(data?.message || "Could not add product");
    }
  } catch (error) {
    const msg =
      error?.message ||
      "Failed to add product";
    toast.error(msg);
  } finally {
    setSubmitting(false);
  }
};


  return (
    <form onSubmit={onSubmitHandler}
    className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2 '>Upload Image</p>
      </div>
      <div className='flex gap-2'>
        <label htmlFor='image1'>
          <img className='w-20'
          src={!image1 ?assets.upload_area :URL.createObjectURL(image1)} alt="Upload Area" />
          <input onChange={(e)=>setImage1(e.target.files[0])}
          type="file" id="image1" hidden />
        </label>
        <label htmlFor='image2'>
          <img className='w-20'
          src={!image2 ?assets.upload_area :URL.createObjectURL(image2)} alt="Upload Area" />
          <input onChange={(e)=>setImage2(e.target.files[0])}
          type="file" id="image2" hidden />
        </label>
        <label htmlFor='image3'>
          <img className='w-20'
          src={!image3 ?assets.upload_area :URL.createObjectURL(image3)} alt="Upload Area" />
          <input onChange={(e)=>setImage3(e.target.files[0])}
          type="file" id="image3" hidden />
        </label>
        <label htmlFor='image4'>
          <img className='w-20'
          src={!image4 ?assets.upload_area :URL.createObjectURL(image4)} alt="Upload Area" />
          <input onChange={(e)=>setImage4(e.target.files[0])}
          type="file" id="image4" hidden />
        </label>
      </div>
    
      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name}
         className='w-full max-w-[500px] border border-gray-300 px-3 py-2 '
        type="text" placeholder="Type here" required/>
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea 
        onChange={(e)=>setDescription(e.target.value)} value={description}
        className='w-full max-w-[500px] border border-gray-300 px-3 py-2 '
        placeholder="Right Content here" required/>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select 
          onChange={(e)=>setCategory(e.target.value)} value={category}
          className='w-full px-3 py-2'>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
       <div>
          <p className='mb-2'>Sub Category</p>
          <select onChange={(e)=>setSubCategory(e.target.value)} value={subCategory}
           className='w-full px-3 py-2'>
            <option value="Top Wear">Top Wear</option>
            <option value="Bottom Wear">Bottom Wear</option>
            <option value="Winter Wear">Winter Wear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input 
          onChange={(e)=>setPrice(e.target.value)} value={price}
          className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
        </div>

      </div>
      <div>
       <p className='mb-2'> Product Sizes</p>
       <div className='flex gap-3 '>
       <div onClick={()=>setSizes(prev =>prev.includes("S") ? prev.filter(item=>item!=="S") : [...prev, "S"] )}>
        <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
       </div>
       <div onClick={()=>setSizes(prev =>prev.includes("M") ? prev.filter(item=>item!=="M") : [...prev, "M"] )}>
        <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
       </div>
       <div onClick={()=>setSizes(prev =>prev.includes("L") ? prev.filter(item=>item!=="L") : [...prev, "L"] )}>
        <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
       </div>
       <div onClick={()=>setSizes(prev =>prev.includes("XL") ? prev.filter(item=>item!=="XL") : [...prev, "XL"] )}>
        <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
       </div>
       <div onClick={()=>setSizes(prev =>prev.includes("XXL") ? prev.filter(item=>item!=="XXL") : [...prev, "XXL"] )}>
        <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
       </div>
      </div>
       </div>
       <div className='flex gap-2 mt-2'>
        <input  onChange={()=> setBestSeller(prev => !prev)} checked={bestSeller}
        type="checkbox" id='bestseller'/>
        <label className='cursor-pointer' htmlFor='bestseller'>Add to Best Seller</label>

       </div>

       <button
        type="submit"
        disabled={submitting}
        className='w-28 py-3 mt-4 bg-black text-white disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {submitting ? "Adding…" : "Add Product"}
      </button>


    </form>
  );
}

export default Add;
