import express from "express";
import {
  getAllUsers,
  searchAllUsers,
  UpdateProfile,
} from "../controllers/userController";
import { authenticationUser } from "../middlewares/authenticationUser";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/search", searchAllUsers);


export default router;
