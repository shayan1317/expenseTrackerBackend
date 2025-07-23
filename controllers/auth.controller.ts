import { Request, Response } from "express";
import prisma from "../lib/PrismaClient";
import { SignupRequestBody } from "../lib/types";
import bcrypt from "bcryptjs";
import { signinSchema, signupSchema } from "../lib/helperFunc";
import jwt from "jsonwebtoken";
export const signupUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    let validationResult = signupSchema.safeParse({ email, password, name });
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      });
    }
    let userExist = await prisma.user.findUnique({ where: { email: email } });

    if (userExist) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    //create password

    const hashedPassword = await bcrypt.hash(password, 8);

    let user = await prisma.user.create({
      data: {
        email: email,
        password_hash: hashedPassword,
        full_name: name,
      },
    });

    const JWT_SECRET_KEY = process.env.JWT_SECRET;
    if (!JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined in .env");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        token: token,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const Login = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) => {
  console.log("ENV", process.env.JWT_SECRET_KEY);
  try {
    const { email, password } = req.body;
    let validationResult = signinSchema.safeParse({ email, password, name });
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      });
    }
    let userExist = await prisma.user.findUnique({ where: { email: email } });

    if (!userExist) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    //create password

    res.status(200).json({
      message: "User LoggedIn successfully",
      user: {
        ...userExist,
      },
    });
  } catch (Err) {
    console.log(Err);
  }
};
