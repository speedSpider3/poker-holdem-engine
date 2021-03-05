"use strict";

const task = require("../task");
const isRunning = require("../utils/is-tournament-running");
const loop = require("../utils/loop-players");
const collectBets = require("./bet-loop");

const Task = Object.create(task);

Task.name = "Draw round";

Task.shouldRun = isRunning;

Task.run =
  async (_, tournament) => {
    const gamestate = tournament.gamestate;

    gamestate.spinCount = 0;

    const startFrom = gamestate.bigBlindPosition;

    await collectBets(gamestate, startFrom);

    if (gamestate.activePlayers.length > 1) {
      await tournament.onFeed(gamestate);
    }

    await loop(gamestate.players, startFrom,
      () => false,
      async (player) => {
        console.log(`requesting discard from ${player.name}`);
        const discards = await player.getDiscards(gamestate);
        discards.forEach(i => {
          player.cards[i] = gamestate.deck.shift();
        });
      });

    if (gamestate.activePlayers.length > 1) {
      await tournament.onFeed(gamestate);
    }

    await collectBets(gamestate, startFrom);

    if (gamestate.activePlayers.length > 1) {
      await tournament.onFeed(gamestate);
    }
  };

module.exports = Task;
