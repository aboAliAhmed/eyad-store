import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
      required: [true, "أدخل البريد الإلكتروني"],
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
      enum: ["مصر"],
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
    passwordChangedAt: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  //generate a plain token => not hashed
  const resetToken = crypto
    .randomBytes(32) // 32 is for number of caracters
    .toString("hex"); // convert it to hexadecimal string

  // create hash with 'sha256' algorithem
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken) // update the token
    .digest("hex"); // store it as a hexadecimal

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
