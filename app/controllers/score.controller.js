const ScoreService = require("../services/score.service");

const ScoreController = {
  create,
  getPlayersTotalScore,
  getPlayerTotalScore,
  getPlayerScoreQuestion,
  getPlayerAnswerResultByHost,
  getHistoryPlayerScore,
};

module.exports = ScoreController;

function create(req, res, next) {
  let { hostId, questionId, answerId, time } = req.body;
  let scoreParams = {
    host: hostId,
    question: questionId,
    player: req.userInfo._id,
    playerAnswer: answerId,
    score: time * 100,
  };
  ScoreService.create(scoreParams)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}

function getPlayersTotalScore(req, res, next) {
  ScoreService.getPlayersTotalScoreByHost(req.params.hostId)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}

function getPlayerTotalScore(req, res, next) {
  let { hostId, playerId } = req.body;
  ScoreService.getPlayerTotalScore(hostId, playerId)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}

function getPlayerScoreQuestion(req, res, next) {
  let { hostId, playerId, questionId } = req.body;
  ScoreService.getPlayerScoreQuestion(hostId, questionId, playerId)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}

function getPlayerAnswerResultByHost(req, res, next) {
  ScoreService.getPlayerAnswerResultByHost(req.body.hostId, req.body.playerId)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}

function getHistoryPlayerScore(req, res, next) {
  ScoreService.getHistoryPlayerScore(req.userInfo._id)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}
