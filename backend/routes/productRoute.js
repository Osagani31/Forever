import express from "express";
import { addProduct, listProducts, removeProduct, singleProduct } from "../controllers/productController.js";
import upload from '../middleware/multer.js';
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();


//Routes
productRouter.post("/add",upload.fields([{ name: "image1", maxCount: 1 },{ name: "image2", maxCount: 1 },{ name: "image3", maxCount: 1 },{ name: "image4", maxCount: 1 }]), adminAuth, addProduct);


productRouter.get("/list", listProducts);


productRouter.delete("/remove", adminAuth, removeProduct);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.delete("/:id", adminAuth, removeProduct);


productRouter.get("/single",adminAuth, singleProduct);
productRouter.post("/single", adminAuth, singleProduct);
productRouter.get("/:id", adminAuth, singleProduct);

export default productRouter;