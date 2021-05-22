const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hostSchema = new Schema(
  {
    pin: { type: Number },
    isLive: { type: Boolean, default: false },
    currentQuestion: { type: Number, default: 0 },
    isSolo: { type: Boolean, default: false },
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    players: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

hostSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Host = mongoose.model("Host", hostSchema);

module.exports = Host;
