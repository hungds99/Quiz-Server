const express = require("express");
const QuizController = require("../controllers/quiz.controller");
const uploadMulter = require("../utils/uploadMulter");
const QuizRouter = express.Router();

// QuizRouter
QuizRouter.post("/create", QuizController.create);
QuizRouter.post("/create-quickly-quiz", QuizController.createQuickQuiz);
QuizRouter.post(
  "/get-pagination-by-creator",
  QuizController.getPaginationByCreator
);
QuizRouter.post(
  "/get-pagination-by-topic",
  QuizController.getPaginationByTopic
);
QuizRouter.post("/get-pagination", QuizController.getPagination);
QuizRouter.get("/", QuizController.getByCreator);
QuizRouter.get("/:id", QuizController.getById);
QuizRouter.delete("/:id", QuizController.deleteById);
QuizRouter.put("/", QuizController.update);
QuizRouter.post(
  "/upload",
  uploadMulter.single("thumbnail"),
  QuizController.uploadThumbnail
);

module.exports = QuizRouter;
