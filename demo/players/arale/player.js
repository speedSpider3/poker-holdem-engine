"use strict";

exports = module.exports = {
  VERSION: "arale folder",
  bet: function (gamestate) {
    console.log(`Hello! My name is ${gamestate.players[gamestate.me].name}, and I always fold.`);

    return 0;
  },
  discard: function (gamestate) {
    console.log(`My name is ${gamestate.players[gamestate.me].name}, and I never discard.`);
    return [];
  },
};
