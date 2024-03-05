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
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;
  const searchTerm = req.query.searchTerm || "";
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "desc";
  let offer = req.query.offer;
  let type = req.query.type;
  let typeFilter = {};

  // if offer not specified get data whose offer === true || false
  if (offer === undefined || offer === "false") {
    offer = { $in: [false, true] };
  }
  if (type !== undefined && type !== "") {
    console.log(req.query);
    typeFilter = { type: type };
  }

  console.log(limit, typeFilter, searchTerm);
  console.log("offer", offer, "type", type, "console", req.query.offer);
  const products = await Product.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ],
    offer,
    ...typeFilter,
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

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
