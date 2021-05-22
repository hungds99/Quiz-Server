const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema(
  {
    host: { type: Schema.Types.ObjectId, ref: "Host" },
    game: { type: Schema.Types.ObjectId, ref: "Game" },
    question: { type: Schema.Types.ObjectId, ref: "Question" },
    player: { type: Schema.Types.ObjectId, ref: "User" },
    playerAnswer: { type: Schema.Types.ObjectId },
    score: { type: Number },
  },
  { timestamps: true }
);

scoreSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
