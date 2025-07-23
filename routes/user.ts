import express from "express";
import { getAllUsers, searchAllUsers } from "../controllers/userController";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/search", searchAllUsers);

export default router;
