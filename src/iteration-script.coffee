# Description:
#   Need to know what this iteration's commitment is?
#   Hubot will tell to what the iteration commitment is.
#
#   Need to know where the team stands on their commitment?
#   Hubot will tell you what the team needs in order to hit their commitment.
#
# Configuration:
#   None
#
# Commands:
#   hubot what is our commitment? - Reports what the current status is for Dev Complete and Accepted bugs/story points
#   hubot commitment - Reports what the current status is for Dev Complete and Accepted bugs/story points
#
# Author: Camden Brown

Metrics = require '../metrics/iterations'
allowedRooms = process.env.ALLOWED_ITERATION_ROOMS.split(' ')
jiraIdentifier = process.env.JIRA_IDENTIFIER
projectIdentifier = process.env.PROJECT_IDENTIFIER

module.exports = (robot) ->

  robot.respond /dev complete story points: (.*)/i, (res) ->
    if (allowedRooms.some (i) ->  res.message.room == i )
      robot.brain.set('devCompleteStoryPointCommitment', res.match[1])
      res.reply "Dev Complete Story Point Commitment: #{res.match[1]}"

  robot.respond /dev complete bugs: (.*)/i, (res) ->
    if (allowedRooms.some (i) ->  res.message.room == i )
      robot.brain.set('devCompleteBugCommitment', res.match[1])
      res.reply "Dev Complete Bug Commitment: #{res.match[1]}"

  robot.respond /commitment/i, (res) ->
    if (allowedRooms.some (i) ->  res.message.room == i )
      devCompleteStoryPointCommitment = robot.brain.get('devCompleteStoryPointCommitment')
      devCompleteBugCommitment = robot.brain.get('devCompleteBugCommitment')

      retrieveTeamCommitment().then (data) ->
        res.reply ["Your team currently has:",
                  "#{data.devCompleteStoryPoints} out of #{devCompleteStoryPointCommitment} story points in Dev Complete.",
                  "#{data.devCompleteBugs} out of #{devCompleteBugCommitment} bugs in Dev Complete"].join "\n"

  retrieveTeamCommitment = ->
    Metrics.getProjectMetrics(jiraIdentifier, projectIdentifier)
