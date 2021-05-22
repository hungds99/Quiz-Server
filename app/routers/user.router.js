const express = require("express");
const UserController = require("../controllers/user.controller");
const uploadAvatarMulter = require("../utils/uploadAvatarMulter");
const UserRouter = express.Router();

// UserRouter
UserRouter.post("/authenticate", UserController.authenticate);
UserRouter.post("/register", UserController.register);
UserRouter.get("/", UserController.getAll);
UserRouter.get("/current", UserController.getCurrent);
UserRouter.get("/:id", UserController.getById);
UserRouter.put("/:id", UserController.update);
UserRouter.delete("/:id", UserController._delete);
UserRouter.post(
  "/upload-avatar",
  uploadAvatarMulter.single("avatar"),
  UserController.uploadAvatar
);
UserRouter.post("/:id/change-password", UserController.changePassword);

module.exports = UserRouter;
