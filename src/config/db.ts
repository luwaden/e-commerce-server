import mongoose from "mongoose";

//const mongodbURI = process.env.MONGODB_URI as string;

const connectDB = async (): Promise<void> => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
};
export default connectDB;
