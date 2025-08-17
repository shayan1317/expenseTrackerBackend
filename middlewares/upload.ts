// middlewares/upload.js
import multer from "multer";

// Configure where and how to store uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Create the multer upload handler
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log("file", file);
    if (file?.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("only images are accepted"));
    }
  },
});

export { upload };
