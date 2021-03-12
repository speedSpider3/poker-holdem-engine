"use strict";

const STATE = require("../../../domain/game/gamestates.js");
const CARDS = require("poker-deck");
const shuffle = require("knuth-shuffle").knuthShuffle;
const task = require("../task");
const loop = require("../utils/loop-players");
const isRunning = require("../utils/is-tournament-running");
const PlayerStates = require("../../../domain/player/states");
const changeGameState = require("../utils/post-gamestate.js");

const Task = Object.create(task);

Task.name = "Assign private cards";

Task.shouldRun = isRunning;

Task.run =
  async (LOGGER, tournament) => {
    const gamestate = tournament.gamestate;

    const deck = shuffle(CARDS.slice(0));
    const assignCard =
      (player) => {
        if (player.state === PlayerStates.get("active")) {
          player.cards.push(deck.shift());
        }
      };

    let cardCount;
    switch (gamestate.mode) {
      default:
      case "Holdem":
        cardCount = 2;
        break;
      case "5Card":
        cardCount = 5;
        break;
    }
    // Dealer starts to assign private cards
    // starting from the player next the him
    const from = gamestate.dealerPosition;
    for (let i = 0; i < cardCount; i++) {
      loop(gamestate.players, from, assignCard);
    }

    gamestate.deck = deck;

    await changeGameState(LOGGER, tournament.serviceUrl, gamestate, STATE.POST_DRAW);
  };

module.exports = Task;
