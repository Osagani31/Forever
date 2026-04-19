import orderModel from "../models/orderModel.js";

const VALID_STATUSES = ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered"];

const buildOrderAmount = (items) => items.reduce((sum, item) => {
  const price = Number(item?.price || 0);
  const qty = Number(item?.quantity || 0);
  return sum + price * qty;
}, 0);

const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const address = req.body?.address || {};
    const paymentMethod = String(req.body?.paymentMethod || "COD").trim() || "COD";

    if (!userId) {
      return res.status(401).json({ success: false, message: "Please login again" });
    }

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const amount = Number(req.body?.amount || buildOrderAmount(items));

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod,
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const order = new orderModel(orderData);
    await order.save();

    return res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1, _id: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1, _id: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params?.id;
    const status = String(req.body?.status || "").trim();

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order id is required" });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid order status" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, message: "Order status updated", order: updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { placeOrder, userOrders, listOrders, updateOrderStatus, VALID_STATUSES };
