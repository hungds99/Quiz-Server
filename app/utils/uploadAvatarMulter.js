const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadAvatarMulter = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

module.exports = uploadAvatarMulter;
