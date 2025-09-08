import  express from "express";
import  cors from "cors";
import mongoose from "mongoose";
const app = express();
app.use(cors());
app.use(express.json());
import  { mainRouter } from "./routes/index.js";
import dotenv from 'dotenv';
dotenv.config();
  
app.use("/api/v1", mainRouter);
//app.use("/api/v1/users", userRouter);

 const connectDB = async () => {
  
    await mongoose.connect(process.env.MONGOURL);
    console.log("database is connected successfully!");
  
};

app.get("/", (req, res) => {
  res.json("Server is up and running");
});

app.listen( 4000, () => {
  connectDB();
  console.log("Server is running on port: " +  4000);
});
  
 
