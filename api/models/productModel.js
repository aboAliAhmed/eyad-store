import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "أدخل اسم المنتج"],
      trim: true,
      minlength: [3, "يجب ألا يقل الإسم عن 3 حروف"],
    },
    regularPrice: {
      type: Number,
      required: [true, "أدخل سعر المنتج"],
    },
    imageURL: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
    },
    offer: {
      type: Boolean,
    },
    available: {
      type: Boolean,
    },
    discountPrice: {
      type: Number,
    },
    orderedQuantity: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
