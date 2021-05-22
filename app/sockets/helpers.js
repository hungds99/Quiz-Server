const Helper = {
  checkPlayerExisted: (players, playerId) => {
    return players.find((player) => {
      return player.toString() == playerId.toString();
    });
  },
  findPlayerIndex: (players, playerId) => {
    return players.findIndex((player) => {
      return player.player.toString() == playerId.toString();
    });
  },
};

module.exports = Helper;
