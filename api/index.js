import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import globalErrorHandler from "./controllers/errorController.js";

const app = express();

app.use(express.json());

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("The connection to database is successful");
  })
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.get("/", (req, res) => {
  res.send("hello");
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello There");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
