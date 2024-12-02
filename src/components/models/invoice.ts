import mongoose, { Document, Schema } from "mongoose";

// Define the interface for Address
export interface IAddress extends Document {
  country: string;
  state: string;
  city: string;
  zipcode: number;
  address1: string;
  address2: string; // Optional field
}

// Define the interface for Service
export interface IService extends Document {
  title: string;
  serialNo: string;
  hsnSac: string;
  quantity: number;
  amount: number;
  gst: number;
}

// Define the interface for Invoice
export interface IInvoice extends Document {
  invoiceID: number;
  customerName: string;
  mobileNumber: string;
  invoiceDate: Date | null;
  address: IAddress;
  vehicleCompany: string;
  vehicleVariant: string;
  vehicleNo: string;
  kilometers: number;
  nextkilometer: number;
  services: IService[];
  status: "active" | "inactive" | "deleted";
  createdBy: mongoose.Types.ObjectId;
  createdOn: Date;
  updatedBy: mongoose.Types.ObjectId;
  updatedOn: Date;
}

// Define the schema for Address type
const AddressSchema = new Schema<IAddress>({
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: Number, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
});

// Define the schema for Service type
const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  serialNo: { type: String, required: true },
  hsnSac: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  gst: { type: Number, required: true },
});

// Define the schema for Invoice type
const InvoiceSchema = new Schema<IInvoice>({
  invoiceID: { type: Number, required: true },
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  invoiceDate: { type: Date, default: null },
  address: { type: AddressSchema, required: true }, // Reference the AddressSchema
  vehicleCompany: { type: String, required: true },
  vehicleVariant: { type: String, required: true },
  vehicleNo: { type: String, required: true },
  kilometers: { type: Number, required: true },
  nextkilometer: { type: Number, required: true },
  services: [ServiceSchema], // Array of ServiceSchema
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active",
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdOn: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedOn: { type: Date, default: Date.now },
});

// Define and export the Invoice model
const InvoiceModel =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default InvoiceModel;
