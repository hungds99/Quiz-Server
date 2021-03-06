const ImageService = require("../services/image.service");
const cloudinary = require("../utils/cloudinary");

const ImageController = {
  upload,
};

module.exports = ImageController;

async function upload(req, res, next) {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "quiz-app/images",
    });
    let imageUrl = result.secure_url;
    let data = await ImageService.create(imageUrl);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
