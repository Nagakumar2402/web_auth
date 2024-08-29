import mongoose from "mongoose";
import { DB_NAME } from "../contacts.js";

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`\n MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
const DisconnectDB = async () => {
  mongoose.connection.close();
  console.log("MongoDB Disconnected");
};
export { ConnectDB, DisconnectDB };
