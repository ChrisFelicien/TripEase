import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTIat) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return changedTimeStamp > JWTIat;
  }

  return false;
};

export default mongoose.model("User", userSchema);
