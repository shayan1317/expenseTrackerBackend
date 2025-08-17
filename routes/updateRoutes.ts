// @ts-nocheck
import express from "express";
import { UpdateProfile } from "../controllers/userController";
import { authenticationUser } from "../middlewares/authenticationUser";

const router = express.Router();
router.patch("/update", authenticationUser, UpdateProfile);
export default router;
