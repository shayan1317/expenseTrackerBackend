import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// GET /api/users
export const getAllUsers = async (req: Request, res: Response) => {
  console.log("heree");
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
