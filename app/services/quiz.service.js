const { Quiz } = require("../helpers/db");
const mongoose = require("mongoose");

const QuizService = {
  create,
  createQuickQuiz,
  getAll,
  getById,
  getByCreator,
  _delete,
  update,
  getPaginationByCreator,
  getPaginationByTopic,
  getPagination,
};

module.exports = QuizService;

async function create(quizParams) {
  const quiz = new Quiz(quizParams);
  return await quiz.save();
}

async function createQuickQuiz(quizParams) {
  const quiz = new Quiz(quizParams);
  return await quiz.save();
}

async function update(quizParams) {
  const quiz = await Quiz.findById(quizParams.id);
  if (quiz) {
    Object.assign(quiz, quizParams);
    return await quiz
      .save()
      .populate("questions")
      .populate("creator")
      .populate("topic");
  }
}

async function getAll() {
  return await Quiz.find();
}

async function getById(id) {
  return await Quiz.findById(id)
    .populate("questions")
    .populate("creator")
    .populate("topic");
}

async function getByCreator(creatorId) {
  return await Quiz.find({ creator: creatorId });
}

async function _delete(id) {
  await Quiz.findByIdAndRemove(id);
}

async function getPaginationByCreator(params) {
  let { creatorId, keyword, pageNumber, pageSize, sortField, sortType } =
    params;
  let data = await Quiz.find({ creator: creatorId })
    .sort({ [sortField]: sortType })
    .skip(pageNumber * pageSize)
    .limit(pageSize)
    .populate("question")
    .populate("topic");
  let total = await Quiz.find({ creator: creatorId }).countDocuments();
  return { data, total };
}

async function getPaginationByTopic(params) {
  let { topic, keyword, pageNumber, pageSize, sortField, sortType } = params;
  let data = await Quiz.find({ topic: topic, isPublic: true })
    .sort({ [sortField]: sortType })
    .skip(pageNumber * pageSize)
    .limit(pageSize)
    .populate("question")
    .populate("creator")
    .populate("topic");
  let total = await Quiz.find({ topic: topic }).countDocuments();
  return { data, total };
}

async function getPagination(params) {
  let { topic, keyword, pageNumber, pageSize, sortField, sortType } = params;
  let filter = { isPublic: true };
  if (topic) {
    filter = { ...filter, topic: topic };
  }
  if (keyword) {
    filter = { ...filter, title: keyword };
  }
  let data = await Quiz.find(filter)
    .sort({ [sortField]: sortType })
    .skip(pageNumber * pageSize)
    .limit(pageSize)
    .populate("question")
    .populate("creator")
    .populate("topic");
  let total = await Quiz.find(filter).countDocuments();
  return { data, total };
}
