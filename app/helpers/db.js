const mongoose = require("mongoose");
const Host = require("../models/host.model");
const Question = require("../models/question.model");
const Quiz = require("../models/quiz.model");
const Topic = require("../models/topic.model");
const User = require("../models/user.model");
const Score = require("../models/score.model");
const Image = require("../models/image.model");

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose
  .connect(process.env.MONGODB_URI, connectionOptions)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
  });

mongoose.Promise = global.Promise;

module.exports = {
  User: User,
  Quiz: Quiz,
  Question: Question,
  Host: Host,
  Topic: Topic,
  Score: Score,
  Image: Image,
};
