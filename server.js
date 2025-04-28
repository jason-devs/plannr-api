/* eslint-disable no-console */
import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./app.js";

dotenv.config();

const connectDB = async () => {
  try {
    const connectionString = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DB_PASSWORD,
    );
    await mongoose.connect(connectionString);
    console.log(`Connection successful`);
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const { PORT, HOST, LOCAL_HOST, NODE_ENV } = process.env;

const host = NODE_ENV === "production" ? HOST : LOCAL_HOST;

app.listen(PORT, host, () => {
  console.log(`<app-name> server listening on port: ${PORT}`);
});
