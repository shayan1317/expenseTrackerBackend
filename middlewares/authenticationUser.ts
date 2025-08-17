import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, DecodedToken } from "../types/Input";
export const authenticationUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer")) {
      res.status(401).json({ error: "no token found" });
      return;
    }
    let token = authHeader.split(" ")[1];

    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    (req as AuthenticatedRequest).user = {
      id: decodedToken.userId,
    } as DecodedToken;
    next();
  } catch (Err) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
