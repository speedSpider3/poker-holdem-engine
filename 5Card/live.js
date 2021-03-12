"use strict";

const childProcess = require("child_process");
const path = require("path");

const chalk = require("chalk");

const config = require("./5Card.json");

const [shouldRunTournament] = process.argv.slice(2);

const pause =
  (thread) => {
    thread.send({ topic: "pause" });
  };

const resume =
  (thread) => {
    thread.send({ topic: "restart" });
  };

const startTournament =
  () => {
    const thread =
      childProcess.fork(path.join(process.cwd(), "5Card", "tournament.js"), process.argv);

    thread.on("message", (msg) => {
      if (msg.topic === "exit") {
        thread.kill();
        process.exit();
      }
    });

    // Listening for the thread's death
    thread.on("exit", (code) => {
      if (code > 0) {
        console.error("Exit with code", code);
      }
    });

    // Start a new tournament
    thread.send({ topic: "create" });

    // Testing pause/resume is working.
    // Issue #6
    setTimeout(pause, 1000, thread);
    setTimeout(resume, 10000, thread);
  };


if (shouldRunTournament) {
  setTimeout(startTournament, 2000);
}
