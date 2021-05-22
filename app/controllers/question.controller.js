const QuestionService = require("../services/question.service");

const QuestionController = {
  create,
  getAllByQuizId,
  getById,
  update,
  _delete,
  getAnswerQuestionById,
};

module.exports = QuestionController;

function create(req, res, next) {
  if (!req.body.answers) {
    req.body.answers = [1, 2, 3, 4].map(() => ({
      answer: "",
      isCorrect: false,
    }));
  }
  QuestionService.create(req.body)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function getAnswerQuestionById(req, res, next) {
  QuestionService.getAnswerQuestionById(req.params.answerId)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function getAllByQuizId(req, res, next) {
  QuestionService.getAllByQuizId(req.query.quizId)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  QuestionService.getById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function update(req, res, next) {
  QuestionService.update(req.params.id, req.body)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  QuestionService._delete(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
