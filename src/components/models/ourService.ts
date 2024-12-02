import mongoose, { Document, Schema } from "mongoose";

export interface OurService extends Document {
  userId: string;
  service: string;
  note: string;
  charge: number;
  gst: number;
}

const ServiceSchema = new Schema<OurService>({
  userId: { type: String, required: true },
  service: { type: String, required: true },
  note: { type: String, required: true },
  charge: { type: Number, required: true },
  gst: { type: Number, required: true },
});

const OurServiceModel =
  mongoose.models.ourservice ||
  mongoose.model<OurService>("ourservice", ServiceSchema);

export default OurServiceModel;
