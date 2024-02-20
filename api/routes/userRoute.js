import express from "express";

const router = express.Router();

router.route("/").get((req, res) => {
  res.json({
    message: "Hello World!",
  });
});

export default router;
