const express = require("express");
const ImageController = require("../controllers/image.controller");
const uploadMulter = require("../utils/uploadMulter");
const ImageRouter = express.Router();

// ImageRouter
ImageRouter.post(
  "/upload",
  uploadMulter.single("image"),
  ImageController.upload
);

module.exports = ImageRouter;
