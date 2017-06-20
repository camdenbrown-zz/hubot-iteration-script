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

Metrics = require('./metrics/iterations');
let allowedRooms = process.env.ALLOWED_ITERATION_ROOMS.split(',');
let jiraIdentifier = process.env.JIRA_IDENTIFIER;
let projectIdentifier = process.env.PROJECT_IDENTIFIER;

module.exports = (robot) => {
  let retrieveTeamCommitment = () => {
    return Metrics.getProjectMetrics(jiraIdentifier, projectIdentifier);
  };

  robot.respond(/dev complete story points: (.*)/i, ({ match, message: { room } }) => {
    if (allowedRooms.some(i => room == i)) {
      robot.brain.set('devCompleteStoryPointCommitment', match[1]);
    }
  })

  robot.respond(/dev complete bugs: (.*)/i, ({ match, message: { room } }) => {
    if (allowedRooms.some(i => room == i)) {
      robot.brain.set('devCompleteBugCommitment', match[1]);
    }
  })

  robot.respond(/commitment/i, ({ match, message: { room }, reply }) => {
    if (allowedRooms.some(i => room == i)) {
      let devCompleteStoryPointCommitment = robot.brain.get('devCompleteStoryPointCommitment');
      let devCompleteBugCommitment = robot.brain.get('devCompleteBugCommitment');

      retrieveTeamCommitment().then(data => {
        reply(
          `Your team currently has:
          ${data.devCompleteStoryPoints} out of ${devCompleteStoryPointCommitment} story points in Dev Complete
          ${data.devCompleteBugs} out of ${devCompleteBugCommitment} bugs in Dev Complete`
        );
      });
    }
  });
};
