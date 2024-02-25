import Product from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";

const sendResponse = (res, product, statusCode) => {
  res.status(statusCode).json({
    status: "success",
    data: {
      product,
    },
  });
};

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  sendResponse(res, products, 200);
});

export const createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  sendResponse(res, product, 202);
});
export const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  sendResponse(res, product, 200);
});
export const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body);
  sendResponse(res, product, 200);
});
export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  res.status(201).json("تم حذف المنتج");
});
