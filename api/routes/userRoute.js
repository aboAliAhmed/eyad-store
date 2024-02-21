import express from "express";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  updateMe,
  deleteUser,
  deleteMe,
} from "../controllers/userController.js";

import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

router.patch("/updateMe", protect, updateMe);
router.patch("/deleteMe", protect, deleteMe);

router
  .route("/")
  .get(getAllUsers)
  .post(protect, restrictTo("admin"), createUser);

router
  .route("/:id")
  .get(getUser)
  .patch(protect, restrictTo("admin"), updateUser)
  .delete(protect, restrictTo("admin"), deleteUser);

export default router;
