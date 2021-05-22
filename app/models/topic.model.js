const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const topicSchema = new Schema(
  {
    name: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    tags: { type: String },
  },
  { timestamps: true }
);

topicSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
