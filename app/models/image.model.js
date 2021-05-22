const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    imageUrl: { type: String },
  },
  { timestamps: true }
);

imageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
