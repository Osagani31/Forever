import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import { listOrders, placeOrder, updateOrderStatus, userOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authUser, placeOrder);
orderRouter.get("/user", authUser, userOrders);
orderRouter.get("/list", adminAuth, listOrders);
orderRouter.post("/status/:id", adminAuth, updateOrderStatus);

export default orderRouter;
