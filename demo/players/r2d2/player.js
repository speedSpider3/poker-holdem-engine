"use strict";

exports = module.exports = {
  VERSION: "BIP DRIP... BIP",
  bet: function (gamestate) {
    const gs = gamestate;
    const p = gs.players;
    const me = p[gs.me];
    console.log(`Hello! My name is ${me.name}, BIP.`);
    return me.chipsBet > 0
      ? gs.callAmount
      : 0;
  },
  discard: function (gamestate) {
    console.log(`My name is ${gamestate.players[gamestate.me].name}, and I discard my whole hand.`);
    return [0, 1, 2, 3, 4];
  },
};
