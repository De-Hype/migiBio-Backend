import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./Routes/userRoutes.js";
import ErrorHandler from "./utils/errorHandler.js";
import AppError from "./utils/AppError.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


async function connect() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected To Database Sucessfully");
  } catch (error) {
    // console.error(error);
    console.log("Error Connecting To Database");
  }
}

app.use("/api/user", userRoutes);
app.all("*", (req, res, next) => {

  next(
    new AppError(
      `Can not find ${req.originalUrl} with ${req.method} on this server`,
      501
    )
  );
});

app.use(ErrorHandler);

const PORT = process.env.Port || 8080;
connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server runing on http://localhost:${PORT}`);
  });
});
