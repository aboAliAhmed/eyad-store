import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, "ثمت مشكلة, أعد المحاولة مرة أخرى"],
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      trim: true,
      maxlength: [20, "يجب ألا يزيد الإسم عن 20 حرفاً"],
      minlength: [3, "يجب ألا يقل الإسم عن 3 حروف"],
    },
    phone: {
      type: Number,
      maxlength: [11, "يجب ألا يزيد رقم الهاتف عن 11 رقماً"],
      minlength: [11, "يجب ألا يقل رقم الهاتف عن 11 رقماً"],
    },
    government: {
      type: String,
      required: [true, "من فضلك أدخل العنوان الخاص بك"],
    },
    city: {
      type: String,
      required: [true, "من فضلك أدخل العنوان الخاص بك"],
    },
    streetAndAppartmentNo: {
      type: String,
      required: [true, "من فضلك أدخل العنوان الخاص بك"],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [
            true,
            "ثمت مشكلة أثناء التسجيل, من فضلك أعد المحاولة مرة أخرى",
          ],
        },
        quantity: {
          type: Number,
          required: [true, "لم يتم تحديد العدد أو الكمية"],
        },
        name: {
          type: String,
        },
        totalPrice: {
          type: Number,
        },
      },
    ],
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
