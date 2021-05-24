const { Topic } = require("../helpers/db");

const TopicService = {
  create,
  getAll,
  getById,
  _delete,
  getRecommendTopic,
};

module.exports = TopicService;

async function create(topicParams) {
  const topic = new Topic(topicParams);
  return await topic.save();
}

async function getAll() {
  return await Topic.find().sort({ createdAt: "desc" }).populate("creator");
}

async function getById(id) {
  return await Topic.findById(id);
}

async function _delete(id) {
  return await Topic.findByIdAndRemove(id);
}

async function getRecommendTopic() {
  return await Topic.find().limit(3);
}
