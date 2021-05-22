const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    host: { type: Schema.Types.ObjectId, ref: "Host" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    score: { type: Number },
  },
  { timestamps: true }
);

playerSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
