const express = require("express");
const HostController = require("../controllers/host.controller");
const HostRouter = express.Router();

// HostRouter
HostRouter.post("/create", HostController.create);
HostRouter.post("/create-single-play", HostController.createSinglePlay);
HostRouter.get("/", HostController.getAll);
HostRouter.get("/get-owner", HostController.getOwner);
HostRouter.get("/:id", HostController.getById);
HostRouter.get("/getByPin/:pin", HostController.getByPin);
HostRouter.put("/update-live-status", HostController.updateLiveStatus);
HostRouter.put(
  "/update-current-question",
  HostController.updateCurrentQuestion
);

module.exports = HostRouter;
