import {
  AuthenticationErrorMessage,
  AuthenticationReturn,
} from "./../types/output";
import { LoginIValues, SignUpIValues } from "./../types/Input";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../lib/PrismaClient";
import { signinSchema, signupSchema } from "../lib/schema";
import { User } from "../types/output";
import { Response, Request } from "express";
export const SignupUser = async (
  req: Request,
  res: Response<AuthenticationReturn | AuthenticationErrorMessage>
) => {
  try {
    const { email, password, name, image } = req.body as SignUpIValues;

    let validationResult = signupSchema.safeParse({
      email,
      password,
      name,
      image,
    });
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailNormalized = email.trim().toLowerCase();
    let user = await prisma.user.create({
      data: {
        email: emailNormalized,
        password_hash: hashedPassword,
        full_name: name,
        image: image,
      },
    });

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: emailNormalized,
        full_name: user.full_name,
        token: token,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const LoginUser = async (
  req: Request,
  res: Response<AuthenticationReturn | AuthenticationErrorMessage>
) => {
  try {
    const { email, password } = req.body as LoginIValues;

    let validationResult = signinSchema.safeParse({ email, password });
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    let userExist = await prisma.user.findUnique({ where: { email } });

    if (!userExist) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password, // the password the user typed
      userExist?.password_hash // the hashed password from your query
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    const JWT_SECRET_KEY = process.env.JWT_SECRET;
    if (!JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined in .env");
    }

    const token = jwt.sign({ userId: userExist?.id }, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "User LoggedIn successfully",
      user: {
        id: userExist?.id,
        email: userExist?.email,
        name: userExist?.full_name,
        token: token,
        image: userExist?.image,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      errors: err.message,
    });
  }
};
