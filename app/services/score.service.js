const { Score, Host } = require("../helpers/db");
const mongoose = require("mongoose");

const ScoreService = {
  create,
  getPlayerScoreQuestion,
  getAllPlayerScore,
  getPlayersTotalScoreByHost,
  getPlayerTotalScore,
  getPlayerAnswerResultByHost,
  getHistoryPlayerScore,
};

module.exports = ScoreService;

async function create(scoreParams) {
  const score = new Score(scoreParams);
  return await score.save();
}

async function getPlayerTotalScore(hostId, playerId) {
  return await Score.aggregate([
    {
      $match: {
        host: mongoose.Types.ObjectId(hostId),
        player: mongoose.Types.ObjectId(playerId),
      },
    },
    { $unwind: "$player" },
    {
      $group: {
        _id: "$player",
        totalScore: { $sum: "$score" },
      },
    },
  ]).then((result) => result[0]);
}

async function getHistoryPlayerScore(playerId) {
  return await Score.aggregate([
    {
      $match: {
        player: mongoose.Types.ObjectId(playerId),
      },
    },
    { $unwind: "$host" },
    {
      $group: {
        _id: "$host",
        player: { $first: "$player" },
        host: { $first: "$host" },
        quiz: { $first: "$quiz" },
        totalScore: { $sum: "$score" },
      },
    },
    {
      $lookup: {
        from: "hosts",
        localField: "_id",
        foreignField: "_id",
        as: "host",
      },
    },
    {
      $lookup: {
        from: "quizzes",
        localField: "host.quiz",
        foreignField: "_id",
        as: "quiz",
      },
    },
    {
      $addFields: {
        host: {
          $arrayElemAt: ["$host", 0],
        },
        quiz: {
          $arrayElemAt: ["$quiz", 0],
        },
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        player: "$player",
        host: "$host",
        quiz: "$quiz",
        totalScore: "$totalScore",
      },
    },
  ]);
}

async function getPlayerScoreQuestion(hostId, questionId, playerId) {
  return await Score.findOne({
    host: hostId,
    question: questionId,
    player: playerId,
  });
}

async function getAllPlayerScore(host) {
  return await Score.aggregate([
    {
      $match: {
        host: mongoose.Types.ObjectId(host),
      },
    },
    { $unwind: "$player" },
    {
      $group: {
        _id: {
          player: "$player",
          //   host: "$host",
        },
        total: { $sum: "$score" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id.player",
        foreignField: "_id",
        as: "player",
      },
    },
  ]);
}

async function getPlayersTotalScoreByHost(hostId) {
  return await Score.aggregate([
    {
      $match: {
        host: mongoose.Types.ObjectId(hostId),
      },
    },
    {
      $group: {
        _id: "$player",
        total: { $sum: "$score" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "player",
      },
    },
    {
      $sort: { total: -1 },
    },
    {
      $project: {
        player: { $arrayElemAt: ["$player", 0] },
        total: 1,
      },
    },
  ]);
}

async function getPlayerAnswerResultByHost(hostId, playerId) {
  return await Score.find({ host: hostId, player: playerId });
}
