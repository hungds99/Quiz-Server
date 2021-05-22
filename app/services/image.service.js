const { Image } = require("../helpers/db");

const ImageService = {
  create,
};

module.exports = ImageService;

async function create(imageUrl) {
  const image = new Image();
  image.imageUrl = imageUrl;
  return await image.save();
}
