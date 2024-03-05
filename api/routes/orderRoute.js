import express from "express";
import {
  createorder,
  getAllorders,
  getOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, restrictTo("admin"), getAllorders)
  .post(createorder);

router.route("/:id").get(protect, getOrder).delete(deleteOrder);

export default router;
