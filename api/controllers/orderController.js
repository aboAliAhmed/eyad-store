import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import catchAsync from "../utils/catchAsync.js";

const sendResponse = (res, order, statusCode) => {
  res.status(statusCode).json({
    status: "success",
    data: {
      order,
    },
  });
};

export const getAllorders = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "desc";

  const orders = await Order.find()
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

  sendResponse(res, orders, 200);
});

export const createorder = catchAsync(async (req, res, next) => {
  const products = req.body.products;
  const orders = await Order.find({});
  //gererate a unique order number
  req.body.orderNumber = 220 + orders.length;
  let product;
  let price = 0;
  let totalPrice = 0;
  let quantity;
  // calculate the total price
  for (let i = 0; i < products.length; i++) {
    product = await Product.findById(products[i].product);
    quantity = products[i].quantity;
    product.offer
      ? (price = product.discountedPrice)
      : (price = product.regularPrice);
    totalPrice += price * quantity;
  }
  req.body.totalPrice = totalPrice;

  const order = await Order.create(req.body);

  sendResponse(res, order, 202);
});

export const getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  sendResponse(res, order, 200);
});
export const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  res.status(201).json("تم إلغاء الطلب");
});
