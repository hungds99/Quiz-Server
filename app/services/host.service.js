const { Host } = require("../helpers/db");
const CodeGenerator = require("../utils/codeGenerator");

const HostService = {
  create,
  getAll,
  getById,
  _delete,
  getByPin,
  updateLiveStatus,
  findAndUpdate,
  createSinglePlay,
  updateCurrentQuestion,
  findAndRemovePlayer,
  getOwner,
};

module.exports = HostService;

async function create(hostParams) {
  const host = new Host(hostParams);
  host.pin = CodeGenerator.generatePin();
  return await host.save();
}

async function createSinglePlay(hostParams) {
  const host = new Host(hostParams);
  return await host.save();
}

async function getAll() {
  return await Host.find();
}

async function updateLiveStatus(hostId, isLive) {
  const update = { isLive: isLive };
  const host = await Host.findById(hostId);
  if (host) {
    Object.assign(host, update);
    return await host.save();
  }
}

async function updateCurrentQuestion(hostId, nextQuestion) {
  try {
    const update = { currentQuestion: nextQuestion };
    const host = await Host.findById(hostId);
    if (host) {
      Object.assign(host, update);
      const hostUpdated = await host.save();
      let response = await Host.populate(hostUpdated, { path: "players" });
      return response;
    }
  } catch (error) {
    console.log("Error : ", error);
  }
}

async function findAndUpdate(hostId, fieldUpdate) {
  try {
    const host = await Host.findById(hostId);
    if (host) {
      Object.assign(host, fieldUpdate);
      const hostUpdated = await host.save();
      let response = await Host.populate(hostUpdated, { path: "players" });
      return response;
    }
  } catch (error) {
    console.log("Error : ", error);
  }
}

async function findAndRemovePlayer(hostId, playerId) {
  return await Host.findByIdAndUpdate(
    { _id: hostId },
    { $pull: { players: playerId } },
    {
      new: true,
    }
  ).populate("players");
}

async function getById(id) {
  return await Host.findById(id).populate("players").populate("creator");
}

async function getByPin(pin) {
  return await Host.findOne({ pin: pin });
}

async function _delete(id) {
  return await Host.findByIdAndRemove(id);
}
async function getOwner(creatorId) {
  return await Host.find({ creator: creatorId })
    .sort({ createdAt: "desc" })
    .populate("quiz")
    .populate("players");
}
