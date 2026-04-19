import { v2 as cloudinary } from 'cloudinary';

import productModel from '../models/productModel.js';

const parseSizes = (sizes) => {
   if (Array.isArray(sizes)) return sizes;
   if (typeof sizes === "string") {
      const trimmed = sizes.trim();
      if (!trimmed) return [];
      return JSON.parse(trimmed);
   }
   return [];
};

// function for add product

const addProduct = async (req, res) => {
   try {
      const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
      const image1 = req.files?.image1?.[0] || null;
      const image2 = req.files?.image2?.[0] || null;
      const image3 = req.files?.image3?.[0] || null;
      const image4 = req.files?.image4?.[0] || null;


      const images = [image1, image2, image3, image4].filter(Boolean);

      if (!name || !description || !price || !category || !subCategory) {
         return res.status(400).json({ success: false, message: "Missing required product fields" });
      }

      if (images.length === 0) {
         return res.status(400).json({ success: false, message: "At least one product image is required" });
      }

      const parsedSizes = parseSizes(sizes);
      if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
         return res.status(400).json({ success: false, message: "sizes must be a non-empty array" });
      }

      let imagesUrl= await Promise.all(images.map(async (item) => {
         let result =await cloudinary.uploader.upload(item.path, { 
            resource_type: "image" });
         return result.secure_url;
         
      }      ));

     const productData = {
         name,
         description,
         price:Number(price),
         category,
         subCategory,
         sizes: parsedSizes,
         bestseller: bestseller === "true" ? true : false,
          image: imagesUrl,
         date:Date.now()
     }

     console.log(productData);

     const product=new productModel(productData);
     await product.save();

      return res.status(201).json({
         success: true,
         message: "Product endpoint hit successfully",
            product: productData
      });
    
   } catch (error) {
    
    console.log(error);
      res.status(500).json({ success: false, message: error.message });


   }

}

//function for list product

const listProducts = async (req, res) => {
   try {

   const products = await productModel.find({}).sort({ date: -1, _id: -1 });

   res.status(200).json({ success: true, products });
   } catch (error) {
    res.status(500).json({ success: false, message: error.message });
   }

}

//function for remove product

const removeProduct = async (req, res) => {
   try {

      const id = req.params?.id || req.body?.id || req.query?.id;
      if (!id) {
         return res.status(400).json({ success: false, message: "Product id is required" });
      }

      const deletedProduct = await productModel.findByIdAndDelete(id);
      if (!deletedProduct) {
         return res.status(404).json({ success: false, message: "Product not found" });
      }

      res.status(200).json({ success: true, message: "Product removed successfully" });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }

}

// function for single product info

const singleProduct = async (req, res) => {
   try {

      const productId = req.params?.id || req.body?.productId || req.body?.id || req.query?.productId || req.query?.id;
      if (!productId) {
         return res.status(400).json({ success: false, message: "productId or id is required" });
      }

      const product = await productModel.findById(productId);

      if (!product) {
         return res.status(404).json({ success: false, message: "Product not found" });
      }

      res.json({ success: true, product });


      
   } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
   }


}

export { addProduct, listProducts, removeProduct, singleProduct };
