const UserService = require("../services/user.service");
const cloudinary = require("../utils/cloudinary");

const UserController = {
  authenticate,
  register,
  getAll,
  getCurrent,
  getById,
  update,
  _delete,
  uploadAvatar,
  changePassword,
};

module.exports = UserController;

function authenticate(req, res, next) {
  UserService.authenticate(req.body)
    .then((user) =>
      user
        ? res.json({ code: 200, result: user })
        : res.json({ code: 401, message: "Email or Password is incorrect" })
    )
    .catch((err) => next(err));
}

function register(req, res, next) {
  UserService.create(req.body)
    .then(() => res.json({ code: 200, result: true }))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  UserService.getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  UserService.getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  UserService.getById(req.params.id)
    .then((user) =>
      user ? res.json({ code: 200, result: user }) : res.sendStatus(404)
    )
    .catch((err) => next(err));
}

function update(req, res, next) {
  UserService.update(req.params.id, req.body)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  UserService.delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

async function uploadAvatar(req, res, next) {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "quiz-app/avatars",
    });
    let userParams = {
      avatar: result.secure_url,
    };
    let data = await UserService.update(req.body.id, userParams);
    res.json({ code: 200, result: data });
  } catch (err) {
    next(err);
  }
}

function changePassword(req, res, next) {
  UserService.updatePassword(req.params.id, req.body)
    .then((data) => res.json({ code: 200, result: data }))
    .catch((err) => next(err));
}
