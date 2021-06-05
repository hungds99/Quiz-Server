const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      index: true,
      unique: [true, "Username is already taken"],
    },
    email: {
      type: String,
      require: true,
      index: true,
      unique: [true, "Username is already taken"],
    },
    avatar: { type: String },
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
