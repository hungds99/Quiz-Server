const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    question: { type: String, require: true },
    time: { type: Number },
    type: { type: String },
    image: { type: String },
    answers: [
      {
        answer: { type: String, require: true },
        isCorrect: { type: Boolean },
      },
    ],
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
  },
  { timestamps: true }
);

questionSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
