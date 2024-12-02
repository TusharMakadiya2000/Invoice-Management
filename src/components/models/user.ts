// UserSchema.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  businessName: string;
  email: string;
  // servieCenterName: string;
  password: string;
  resetOTP: string;
  role: "garage" | "super admin";
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  businessName: { type: String, required: true },
  email: { type: String, required: true },
  // servieCenterName: { type: String, required: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["garage", "super admin"],
    default: "garage",
  },

  resetOTP: { type: String },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
