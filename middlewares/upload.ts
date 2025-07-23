// middlewares/upload.js
import multer from "multer";
import path from "path";
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
const upload = multer({ storage });

export { upload };
