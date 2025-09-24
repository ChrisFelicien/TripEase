import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Provide your fullname"],
      min: 3
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Provide your email"],
      validate: {
        validator: validator.isEmail,
        message: `Provide valid email`
      }
    },
    password: {
      type: String,
      required: [true, "Provide you password"],
      min: 8
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    passwordChangedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);
