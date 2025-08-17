import { FileUploadRequest } from "../types/Input";
import { ErrorResponse, FileUploadResponse } from "../types/output";
import { Response } from "express";
export const UploadFile = (
  req: FileUploadRequest,
  res: Response<FileUploadResponse | ErrorResponse>
) => {
  try {
    console.log("req", req?.file);
    if (!req?.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: `${req.protocol}://${req.get("host")}/uploads/${encodeURIComponent(
        req.file.filename
      )}`,
      size: req.file.size,
    };
    res
      .status(200)
      .json({ message: "Image uploaded successfully", file: fileInfo });
    console.log("req", req?.file);
  } catch (Err) {
    console.log(Err);
  }
};
