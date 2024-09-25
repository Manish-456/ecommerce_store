import mongoose from "mongoose";

mongoose.set("strictQuery", false);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to DB ${error.message}`);
    process.exit(1);
  }
};
