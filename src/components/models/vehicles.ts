import mongoose, { Document, Schema } from "mongoose";

export interface vehicles extends Document {
  userId: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleType: string;
  ownerName: string;
  mobileNumber: string;
}

const VehiclesSchema = new Schema<vehicles>({
  userId: { type: String, required: true },
  vehicleName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  vehicleType: { type: String, required: true },
  ownerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
});

const OurVehicleModel =
  mongoose.models.vehicles ||
  mongoose.model<vehicles>("vehicles", VehiclesSchema);

export default OurVehicleModel;
