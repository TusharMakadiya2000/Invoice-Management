// mongodb.ts
import mongoose, { ConnectionStates } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

type TConnection = {
  isConnected: ConnectionStates;
};
const connection = {} as TConnection;
const connectDB = async () => {
  try {
    if (connection.isConnected) {
      console.log("Already Connected");
      return;
    }
    const db = await mongoose.connect(process.env.MONGO_URI || ("" as string), {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log("DB Connected");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log("error", error);
    console.error("Error connecting to MongoDB: >>>>>>>>> ", error);
  }
};
export default connectDB;

export const disconnectDB = async () => {
  try {
    if (connection.isConnected) {
      connection.isConnected = 0;
      return;
    }
    const db = await mongoose.disconnect();
    console.log("DB Disconnected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
export const withDatabase =
  (handler: any) => async (req: NextRequest, res: NextResponse) => {
    try {
      connectDB();
      return handler(req, res);
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      return NextResponse.json({
        status: 500,
        message: "Internal Server Error",
      });
    } finally {
      await disconnectDB();
    }
  };
