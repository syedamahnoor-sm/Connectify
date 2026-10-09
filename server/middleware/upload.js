import multer from "multer";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB (posts can contain video)

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 2 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      return cb(null, true);
    }
    cb(new Error("Only image and video files are allowed"));
  },
});

export default upload;
