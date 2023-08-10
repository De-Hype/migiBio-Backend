import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import userRoutes from './Routes/userRoutes.js'
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.Port || 8080;

async function connect() {
  try {
    await mongoose.connect(process.env.DB_URI);

    console.log(process.env.DB_URI);
    console.log("Connected To Database");
  } catch (error) {
    console.error(error);
    console.log("Error To Database");
  }
}
connect();

app.use('/api/user', userRoutes )

app.listen(PORT, () => {
  console.log(`Server runing on http://localhost:${PORT}`);
});
