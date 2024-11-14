import mongoose from "mongoose";

export const connectToMongoDb = () => {
  try {
    mongoose.connect(process.env.DB_CONNECT_URL) && console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};
