const { Question } = require("../helpers/db");
const QuizService = require("./quiz.service");

const QuestionService = {
  create,
  getAllByQuizId,
  getById,
  update,
  _delete,
  getAnswerQuestionById,
};

module.exports = QuestionService;

async function create(questionParams) {
  const question = new Question(questionParams);
  const quizId = question.quiz;
  const quiz = await QuizService.getById(quizId);
  if (!quiz) throw "Quiz not found !";
  const questionSaved = await question.save();
  const questionId = questionSaved.id;
  Object.assign(quiz, {
    ...quiz,
    questions: quiz.questions.push(questionId),
  });
  await QuizService.create(quiz);
  return question;
}

async function getAllByQuizId(quizId) {
  const quiz = await QuizService.getById(quizId);
  if (!quiz) throw "Quiz not found !";
  return await Question.find({ quiz: quiz.id }).populate("quiz");
}

async function getById(questionId) {
  return await Question.findById(questionId);
}

async function getAnswerQuestionById(questionId, answerId) {
  return await Question.findOne(
    { _id: questionId },
    { answers: { $elemMatch: { _id: answerId } } }
  );
}

async function update(questionId, quesionParam) {
  const question = await Question.findById(questionId);
  if (!question) throw "Question not found";

  Object.assign(question, quesionParam);

  return await question.save();
}

async function _delete(questionId) {
  return await Question.findByIdAndRemove(questionId);
}
