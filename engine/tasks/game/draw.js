"use strict";

const task = require("../task");
const isRunning = require("../utils/is-tournament-running");
const loop = require("../utils/loop-players");

const Task = Object.create(task);

Task.name = "Draw round";

Task.shouldRun = isRunning;

Task.run =
  async (LOGGER, tournament) => {
    const gamestate = tournament.gamestate;

    const startFrom = gamestate.bigBlindPosition;

    if (gamestate.activePlayers.length > 1) {
      await tournament.onFeed(gamestate);
    }

    await loop(gamestate.players, startFrom,
      async (player) => {
        LOGGER.debug(`requesting discard from ${player.name}`);
        const discards = await player.getDiscards(gamestate);
        LOGGER.debug(`${player.name} wants to discard ${discards}`);
        if (discards != null) {
          Array.prototype.forEach.call(discards, i => {
            LOGGER.debug(player.cards.length);
            player.cards[i] = gamestate.deck.shift();
          });
        }
      });

    if (gamestate.activePlayers.length > 1) {
      await tournament.onFeed(gamestate);
    }
  };

module.exports = Task;
