const sharp = require("sharp");
const path = require("path");

class ResizeMulter {
  async save(buffer) {
    return await sharp(buffer)
      .resize(300, 300, {
        // size image 300x300
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();
  }
}
module.exports = ResizeMulter;
