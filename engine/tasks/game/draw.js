"use strict";

const STATE = require("../../../domain/game/gamestates.js");
const task = require("../task");
const isRunning = require("../utils/is-tournament-running");
const loop = require("../utils/loop-players-async");
const changeGameState = require("../utils/post-gamestate.js");

const Task = Object.create(task);

Task.name = "Draw round";

Task.shouldRun = isRunning;

Task.run =
  async (LOGGER, tournament) => {
    const gamestate = tournament.gamestate;

    await changeGameState(LOGGER, tournament.serviceUrl, gamestate, STATE.DRAW);

    const startFrom = gamestate.bigBlindPosition;

    if (gamestate.activePlayers.length > 1) {
      await tournament.onFeed(gamestate);
    }

    await loop(gamestate.players, startFrom,
      () => false,
      async (player) => {
        LOGGER.debug(`requesting discards from ${player.name}`);
        const discards = await player.getDiscards(gamestate);
        discards.forEach(i => {
          gamestate.commonCards.push(player.cards[i]);
          player.cards[i] = gamestate.deck.shift();
        });
      });

    if (gamestate.activePlayers.length > 1) {
      await tournament.onFeed(gamestate);
    }
  };

module.exports = Task;
