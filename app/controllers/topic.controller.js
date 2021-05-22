const TopicService = require("../services/topic.service");

const TopicController = {
  create,
  getAll,
  getById,
  _delete,
  getRecommendTopic,
};

module.exports = TopicController;

function create(req, res, next) {
  let topic = {
    ...req.body,
    creator: req.userInfo._id,
  };
  TopicService.create(topic)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  TopicService.getAll()
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  TopicService.getById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  TopicService._delete(req.params.id)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}

function getRecommendTopic(req, res, next) {
  TopicService.getRecommendTopic()
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}
