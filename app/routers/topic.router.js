const express = require("express");
const TopicController = require("../controllers/topic.controller");
const TopicRouter = express.Router();

// TopicRouter
TopicRouter.post("/create", TopicController.create);
TopicRouter.get("/get-recommend-topic", TopicController.getRecommendTopic);
TopicRouter.get("/", TopicController.getAll);
TopicRouter.get("/:id", TopicController.getById);
TopicRouter.delete("/:id", TopicController._delete);

module.exports = TopicRouter;
