import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "أدخل اسمك"],
      unique: [true, "هذا الإسم موجود بالفعل, اختر اسماً أخر"],
      trim: true,
      maxlength: [20, "يجب ألا يزيد الإسم عن 20 حرفاً"],
      minlength: [3, "يجب ألا يقل الإسم عن 3 حروف"],
    },
    email: {
      type: String,
      required: [true, "أدخل حساب المستخدم"],
      unique: [true, "هذا الحساب موجود بالفعل, اختر حساباً أخر"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "حدد كلمة المرور"],
      maxlength: [20, "يجب ألا يزيد الإسم عن 20 حرفاً"],
      minlength: [9, "يجب ألا تقل كلمة المرور عن 9 حروف"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "modrator", "admin"],
      default: "user",
    },
    phone: {
      type: Number,
      maxlength: [11, "يجب ألا يزيد رقم الهاتف عن 11 رقماً"],
      minlength: [11, "يجب ألا يقل رقم الهاتف عن 11 رقماً"],
    },
    country: {
      type: String,
      enum: ["egypt"],
    },
    government: {
      type: String,
    },
    city: {
      type: String,
    },
    streetAndAppartmentNo: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
