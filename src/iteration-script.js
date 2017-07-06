// Description:
//   Need to know what this iteration's commitment is?
//   Hubot will tell to what the iteration commitment is.
//
//   Need to know where the team stands on their commitment?
//   Hubot will tell you what the team needs in order to hit their commitment.
//
// Configuration:
//   None
//
// Commands:
//   hubot what is our commitment? - Reports what the current status is for Dev Complete and Accepted bugs/story points
//   hubot commitment - Reports what the current status is for Dev Complete and Accepted bugs/story points
//
// Author: Camden Brown

import Metric from './metrics/metric';
let allowedRooms = process.env.ALLOWED_ITERATION_ROOMS.split(',');

module.exports = (robot) => {
  robot.respond(/dev complete story points: (.*)/i, (res) => {
    if (allowedRooms.some(i => res.message.room == i)) {
      robot.brain.set('devCompleteStoryPointCommitment', res.match[1]);
      res.reply(`Updated to ${res.match[1]}`);
    }
  })

  robot.respond(/dev complete bugs: (.*)/i, (res) => {
    if (allowedRooms.some(i => res.message.room == i)) {
      robot.brain.set('devCompleteBugCommitment', res.match[1]);
      res.reply(`Updated to ${res.match[1]}`);
    }
  })

  robot.respond(/commitment/i, (res) => {
    if (allowedRooms.some(i => res.message.room == i)) {
      let devCompleteStoryPointCommitment = robot.brain.get('devCompleteStoryPointCommitment');
      let devCompleteBugCommitment = robot.brain.get('devCompleteBugCommitment');
      let metric = new Metric();

      res.reply(
        `Your team currently has:
        ${metric.getDevCompleteStoryPoints()} out of ${devCompleteStoryPointCommitment} story points in Dev Complete
        ${metric.getDevCompleteBugs()} out of ${devCompleteBugCommitment} bugs in Dev Complete`
      );
    }
  });
};
