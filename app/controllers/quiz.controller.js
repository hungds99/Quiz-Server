const QuizService = require("../services/quiz.service");
const path = require("path");
const ResizeMulter = require("../utils/resizeMulter");

const QuizController = {
  create,
  createQuickQuiz,
  getAll,
  getByCreator,
  getById,
  update,
  uploadThumbnail,
  getPaginationByCreator,
  getPaginationByTopic,
  getPagination,
  deleteById,
};

module.exports = QuizController;

function create(req, res, next) {
  let quiz = {
    ...req.body,
    creator: req.userInfo._id,
  };
  QuizService.create(quiz)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}

function createQuickQuiz(req, res, next) {
  let quiz = {
    ...req.body,
    creator: req.userInfo._id,
  };
  QuizService.createQuickQuiz(quiz)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}

function update(req, res, next) {
  QuizService.update(req.body)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  QuizService.getAll()
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function getByCreator(req, res, next) {
  let creatorId = req.userInfo._id;
  QuizService.getByCreator(creatorId)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  QuizService.getById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

async function uploadThumbnail(req, res, next) {
  let quizParams = {
    id: req.body.id,
    thumbnail: req.file.path.replace(/\\/g, "/"),
  };
  QuizService.update(quizParams)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}

function getPaginationByCreator(req, res, next) {
  let { keyword, pageNumber, pageSize, sortField, sortType } = req.body;
  let params = {
    creatorId: req.userInfo._id,
    keyword: keyword || "",
    pageNumber: pageNumber || 0,
    pageSize: pageSize || 10,
    sortField: sortField || "createdAt",
    sortType: sortType || "desc",
  };
  QuizService.getPaginationByCreator(params)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}

function getPaginationByTopic(req, res, next) {
  let { topic, keyword, pageNumber, pageSize, sortField, sortType } = req.body;
  let params = {
    topic: topic,
    keyword: keyword || "",
    pageNumber: pageNumber || 0,
    pageSize: pageSize || 10,
    sortField: sortField || "createdAt",
    sortType: sortType || "desc",
  };
  QuizService.getPaginationByTopic(params)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}

function getPagination(req, res, next) {
  let { topic, keyword, pageNumber, pageSize, sortField, sortType } = req.body;
  let params = {
    topic: topic,
    keyword: keyword,
    pageNumber: pageNumber || 0,
    pageSize: pageSize || 12,
    sortField: sortField || "createdAt",
    sortType: sortType || "desc",
  };
  QuizService.getPagination(params)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}
function deleteById(req, res, next) {
  QuizService._delete(req.params.id)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}
