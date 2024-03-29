import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import globalErrorHandler from "./controllers/errorController.js";

const __dirname = path.resolve();
dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "/client/dist")));

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

// Routes
app.get("/", (req, res) => {
  res.send("أهلاً");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
