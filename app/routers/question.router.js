const express = require("express");
const QuestionController = require("../controllers/question.controller");
const QuestionRouter = express.Router();
const uploadMulter = require("../utils/uploadMulter");

// QuizRouter
QuestionRouter.post("/create", QuestionController.create);
QuestionRouter.get("/", QuestionController.getAllByQuizId);
QuestionRouter.get("/:id", QuestionController.getById);
QuestionRouter.put("/:id", QuestionController.update);
QuestionRouter.delete("/:id", QuestionController._delete);
QuestionRouter.get(
  "/get-answer/:answerId",
  QuestionController.getAnswerQuestionById
);

module.exports = QuestionRouter;
