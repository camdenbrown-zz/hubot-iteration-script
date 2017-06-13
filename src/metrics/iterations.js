metovaMetrics = require('metova-metrics');
devComplete = require('../metrics/devComplete');

var projectIdentifier,
    projectKey;

module.exports = {
  getProjectMetrics: getProjectMetrics
};

function getProjectStatuses(cb) {
  return new Promise(function(resolve, reject){
    metovaMetrics.getMetrics({}, function(data) {
      resolve(data['data'].map(buildProjectJiraStatus));
    });
  });
}

function buildProjectJiraStatus(data) {
  return {
    project: data.identifier,
    acceptedStoryPoints: filterStoryPoints(data.value.statuses),
    acceptedBugs: filterAcceptedBugs(data.value.statuses),
    devCompleteStoryPoints: devComplete.getDevCompleteStories(),
    devCompleteBugs: devComplete.getDevCompleteBugs()
  }
}

function getProjectMetrics(identifier, projectName) {
  projectIdentifier = identifier;
  projectKey = projectName;
  return getProjectStatuses().then(data => {
    return data.find(retrieveProject);
  })
}

function retrieveProject(data) {
  return data.project === projectIdentifier;
}

function filterStoryPoints(statuses) {
  if(statuses.Accepted) {
    return statuses.Accepted.story_points || 0;
  }
  return 0;
}

function filterAcceptedBugs(statuses) {
  if(statuses.Accepted) {
    return statuses.Accepted.bugs || 0;
  }
  return 0;
}
