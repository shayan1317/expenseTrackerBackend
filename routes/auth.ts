import express from "express";
import { signupUser } from "../controllers/auth.controller.ts";
import { upload } from "../middlewares/upload.ts";

const router = express.Router();

router.post("/signup", upload.single("image"), signupUser);
// router.post("/login", loginUser);
export default router;
