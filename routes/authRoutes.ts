// @ts-nocheck
import express from "express";

import { upload } from "../middlewares/upload";
import { LoginUser, SignupUser } from "../controllers/authController";
import { UploadFile } from "../controllers/uploadFileController";

const router = express.Router();

router.post("/signup", SignupUser);
router.post("/login", LoginUser);
export default router;
