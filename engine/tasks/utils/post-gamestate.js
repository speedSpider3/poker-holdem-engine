const send = require("request");

module.exports = (LOGGER, serviceUrl, gamestate, newState) => {
  const payload = Object.create(null);
  payload.game = gamestate.gameProgressiveId;
  payload.hand = gamestate.handProgressiveId;
  payload.spinCount = gamestate.spinCount;

  payload.dealer = gamestate.dealerPosition;
  payload.sb = gamestate.sb;

  payload.pot = gamestate.pot;
  payload.sidepots = gamestate.sidepots;

  payload.commonCards = gamestate.commonCards;

  payload.newState = newState;

  payload.players = gamestate.players
    .map(
      (player) => {
        const playerWithoutCards = {
          chips: player.chips,
          chipsBet: player.chipsBet,
          id: player.id,
          name: player.name,
          state: player.state,
        };

        return {
          cards: player.cards,
          ...playerWithoutCards,
        };
      }
    );

  return new Promise((resolve) => {
    send.post(serviceUrl + "changegamestate", {
      body: payload,
      json: true,
      followAllRedirects: true,
      maxRedirects: 1,
      timeout: 5000,
    }, (err, _) => {
      if (err) {
        LOGGER.warn(`Request to ${serviceUrl} failed, cause ${err.message}.`, { tag: gamestate.handUniqueId });
      }

      resolve();
    });
  });
};
