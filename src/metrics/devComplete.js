metovaMetrics = require('metova-metrics')
moment = require('moment');

var thirtyMinutes = 30 * 60 * 1000,
    previousIterationStartDate = moment().startOf('isoWeek').subtract(3, 'days').startOf('day'),
    newIterationStartDate = moment().startOf('isoWeek').add(4, 'days'),
    totalDevCompleteStories = 0,
    totalDevCompleteBugs = 0;

module.exports = {
  getDevCompleteStories: getDevCompleteStories,
  getDevCompleteBugs: getDevCompleteBugs
};

function getDevCompleteStories() {
  return totalDevCompleteStories;
}

function getDevCompleteBugs() {
  return totalDevCompleteBugs;
}

function updateDevCompleteMetrics() {
  totalDevCompleteBugs = 0;
  totalDevCompleteStories = 0;
  metovaMetrics.getMetrics({namespace: "jira", metric: "stories"}, function(data) {
    data['data'].forEach(buildProjectStatus);
  });
}

function buildProjectStatus(data) {
  var ticket = data.value;
  if(filterIterationDevComplete(data)) {
    if(ticket.issue_type === 'Story') {
      totalDevCompleteStories += ticket.story_point_value;
    } else if (ticket.issue_type === 'Bug') {
      totalDevCompleteBugs += 1;
    }
  }
}

function filterIterationDevComplete(data){
  var ticket = data.value;
  return ticket.project_key === process.env.PROJECT_IDENTIFIER
         && (ticket.state === 'completed' || ticket.state === 'accepted')
         && moment(ticket.completed_at).isBetween(previousIterationStartDate, newIterationStartDate);
}

if(!totalDevCompleteStories || !totalDevCompleteBugs) {
  updateDevCompleteMetrics()
}

setInterval(updateDevCompleteMetrics, thirtyMinutes);
