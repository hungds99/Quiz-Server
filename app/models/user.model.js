const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, require: true },
    avatar: { type: String },
    email: { type: String, unique: true, require: true },
    hash: { type: String, require: true },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
