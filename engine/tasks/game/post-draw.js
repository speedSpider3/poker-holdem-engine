"use strict";

const task = require("../task");
const isRunning = require("../utils/is-tournament-running");
const collectBets = require("./bet-loop");

const Task = Object.create(task);

Task.name = "POST DRAW betting round";

Task.shouldRun =
  (tournament) =>
    isRunning(tournament) &&
      tournament.gamestate.activePlayers.length > 1;

Task.run =
  async (LOGGER, tournament) => {
    const gamestate = tournament.gamestate;

    const playersWhoCanBetCount = gamestate.activePlayers
      .filter((player) => !player.allin)
      .length;

    if (playersWhoCanBetCount > 1) {
      LOGGER.debug("The post-draw betting session is starting.", { tag: gamestate.handUniqueId });

      gamestate.spinCount = 0;

      const startFrom = gamestate.dealerPosition;
      await collectBets(gamestate, startFrom);
    }
  };

module.exports = Task;
