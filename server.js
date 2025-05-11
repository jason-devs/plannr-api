/* eslint-disable no-console */
import mongoose from "mongoose";
import dotenv from "dotenv";
import minimist from "minimist";

import app from "./app.js";

mongoose.set("strictQuery", true);
dotenv.config();

const connectDB = async () => {
  try {
    const connectionString = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DB_PASSWORD,
    ).replace("<USERNAME>", process.env.DB_USERNAME);
    await mongoose.connect(connectionString);
    console.log(`Connection successful`);
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const { PORT } = process.env;

const argv = minimist(process.argv.slice(2));
const host = argv.host ? "0.0.0.0" : "localhost";

app.listen(PORT, host, () => {
  console.log(`Plannr server listening on http://${host}:${PORT}`);
});
