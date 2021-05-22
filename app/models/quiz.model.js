const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema(
  {
    hostId: { type: Number },
    title: { type: String, require: true },
    thumbnail: { type: String },
    isPublic: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    topic: { type: Schema.Types.ObjectId, ref: "Topic" },
  },
  { timestamps: true }
);

quizSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
