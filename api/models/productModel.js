import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "أدخل اسم المنتج"],
      trim: true,
      minlength: [3, "يجب ألا يقل الإسم عن 3 حروف"],
    },
    description: {
      type: String,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
    },
    offer: {
      type: Boolean,
    },
    imgURLs: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
