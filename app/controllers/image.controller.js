const ImageService = require("../services/image.service");

const ImageController = {
  upload,
};

module.exports = ImageController;

function upload(req, res, next) {
  let imageUrl = req.file.path;
  ImageService.create(imageUrl)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
