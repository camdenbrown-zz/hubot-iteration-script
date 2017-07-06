import DevCompleteTickets from './services/retrieveDevCompleteTickets';
const jiraIdentifier = process.env.JIRA_IDENTIFIER;
const projectIdentifier = process.env.PROJECT_IDENTIFIER;

export default class Metric {
  constuctor() {
    return Metrics.getProjectMetrics(jiraIdentifier, projectIdentifier);
  }

  getDevCompleteBugs() {
    new DevCompleteTickets().getBugCount();
  }

  getDevCompleteStoryPoints() {
    new DevCompleteTickets().getStoryPoints();
  }
}
