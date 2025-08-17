// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AuthenticatedRequest, DecodedToken } from "../types/Input";
import { AuthenticationErrorMessage, User } from "../types/output";
import { updateProfileSchema } from "../lib/schema";

const prisma = new PrismaClient();

// GET /api/users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        created_at: true,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// GET /api/users/search?q=...
export const searchAllUsers = async (req, res) => {
  const search_query = req.query.q as string;

  if (!search_query) {
    return res.status(400).json({ error: "Query parameter  is required" });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { full_name: { contains: search_query, mode: "insensitive" } },
          { email: { contains: search_query, mode: "insensitive" } },
        ],
      },
      // need onlly these fields from db
      select: {
        id: true,
        full_name: true,
        email: true,
        created_at: true,
      },
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};

export const UpdateProfile = async (
  req: Request,
  res: Response<User | AuthenticationErrorMessage>
) => {
  try {
    const updateProfileInput = req.body;

    console.log("updateProfileInput", updateProfileInput);
    if (!req?.user?.id) {
      res.status(401).json({ message: "User not authenticated" });
    }

    let user = await prisma?.user.findUnique({ where: { id: req?.user?.id } });
    if (!user) return res.status(400).json({ message: "User not found" });

    let validationResult = updateProfileSchema.safeParse(updateProfileInput);
    if (!validationResult?.success) {
      return res.status(400).json({ message: "Input is not validated" });
    }

    let updatedUser = await prisma.user.update({
      where: { id: req?.user?.id },
      data: {
        full_name: validationResult?.data.name,
        image: validationResult?.data.image,
      },
      select: {
        image: true,
        full_name: true,
        created_at: true,
        email: true,
        id: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (Err) {
    console.log(Err);
  }
};
