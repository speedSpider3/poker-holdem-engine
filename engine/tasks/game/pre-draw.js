"use strict";

const task = require("../task");
const isRunning = require("../utils/is-tournament-running");
const collectBets = require("./bet-loop");

const Task = Object.create(task);

Task.name = "PRE DRAW betting round";

Task.shouldRun =
  (tournament) =>
    isRunning(tournament);

Task.run =
  async (LOGGER, tournament) => {
    const gamestate = tournament.gamestate;

    LOGGER.debug("The pre-draw betting session is starting.", { tag: gamestate.handUniqueId });

    gamestate.spinCount = 0;

    const startFrom = gamestate.bigBlindPosition;

    await collectBets(gamestate, startFrom);
  };

module.exports = Task;
