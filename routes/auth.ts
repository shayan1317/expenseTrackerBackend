// @ts-nocheck
import express from "express";

import { upload } from "../middlewares/upload.ts";
import { LoginUser, SignupUser } from "../controllers/authController.ts";
import { UploadFile } from "../controllers/uploadFileController.ts";

const router = express.Router();

router.post("/signup", SignupUser);
router.post("/login", LoginUser);
export default router;
