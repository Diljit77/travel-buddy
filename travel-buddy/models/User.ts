import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    provider: {
      type: String,
      enum: ["local", "google", "apple"],
      default: "local",
    },

    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);
 const User= mongoose.models.User || mongoose.model("User", UserSchema);
 export default User;