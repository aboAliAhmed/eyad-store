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

const router = express.Router();

import dotenv from "dotenv";

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
