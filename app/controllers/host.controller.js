const HostService = require("../services/host.service");

const HostController = {
  create,
  getAll,
  getById,
  getByPin,
  updateLiveStatus,
  createSinglePlay,
  updateCurrentQuestion,
  getOwner,
};

module.exports = HostController;

function updateLiveStatus(req, res, next) {
  let { hostId, isLive } = req.body;
  HostService.updateLiveStatus(hostId, isLive)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function updateCurrentQuestion(req, res, next) {
  let { hostId, nextQuestion } = req.body;
  HostService.updateCurrentQuestion(hostId, nextQuestion)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}

function createSinglePlay(req, res, next) {
  let host = {
    ...req.body,
    creator: req.userInfo._id,
    isSolo: true,
  };
  HostService.createSinglePlay(host)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}

function create(req, res, next) {
  let host = {
    ...req.body,
    creator: req.userInfo._id,
  };
  HostService.create(host)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  HostService.getAll()
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  HostService.getById(req.params.id)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}

function getByPin(req, res, next) {
  HostService.getByPin(req.params.pin)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}

function getOwner(req, res, next) {
  let creatorId = req.userInfo._id;
  HostService.getOwner(creatorId)
    .then((data) => res.json({ code: 200, message: "", result: data }))
    .catch((err) => next(err));
}
