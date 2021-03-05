"use strict";

exports = module.exports = {
  VERSION: "BEER powered bot",
  bet: function (gamestate) {
    console.log(`Hello! My name is ${gamestate.players[gamestate.me].name}. I'm calling for ${gamestate.callAmount}`);
    return gamestate.callAmount;
  },
  discard: function (gamestate) {
    console.log(`My name is ${gamestate.players[gamestate.me].name}, and I discard the last card in my hand.`);
    return [4];
  },
};
