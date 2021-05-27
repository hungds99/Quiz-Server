const Helper = {
  checkPlayerExisted: (players, playerId) => {
    return players.find((player) => {
      return player._id.toString() == playerId.toString();
    });
  },
  findPlayerIndex: (players, playerId) => {
    return players.findIndex((player) => {
      return player._id.toString() == playerId.toString();
    });
  },
};

module.exports = Helper;
