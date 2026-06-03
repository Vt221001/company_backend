import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import connectDB from "./Db/db";
import { app } from "./app";

const port: number = Number(process.env.PORT) || 5000;

connectDB()
  .then(() => {
    console.log("DB connected Successfully");

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    server.on("error", (error: Error) => {
      console.log("Server error:", error);

      throw error;
    });
  })
  .catch((err: Error) => {
    console.log("MongoDB connection failed:", err);
  });