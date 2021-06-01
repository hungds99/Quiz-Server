const express = require("express");
const ScoreController = require("../controllers/score.controller");

const ScoreRouter = express.Router();

// ScoreRouter
ScoreRouter.post(
  "/get-history-player-score",
  ScoreController.getHistoryPlayerScore
);
ScoreRouter.get(
  "/get-players-total-score/:hostId",
  ScoreController.getPlayersTotalScore
);
ScoreRouter.post(
  "/get-player-answer-result",
  ScoreController.getPlayerAnswerResultByHost
);
ScoreRouter.post(
  "/get-player-total-score",
  ScoreController.getPlayerTotalScore
);
ScoreRouter.post(
  "/get-player-score-question",
  ScoreController.getPlayerScoreQuestion
);
ScoreRouter.post("/", ScoreController.create);

module.exports = ScoreRouter;
