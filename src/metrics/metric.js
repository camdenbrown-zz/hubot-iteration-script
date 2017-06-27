import DevCompleteTickets from './services/retrieveDevCompleteTickets';
import AcceptedTickets from './services/retrieveAcceptedTickets';

class Metric {
  constuctor() {
    let jiraIdentifier = process.env.JIRA_IDENTIFIER;
    let projectIdentifier = process.env.PROJECT_IDENTIFIER;
    return Metrics.getProjectMetrics(jiraIdentifier, projectIdentifier);
  }

  getDevCompleteBugs() {
    DevCompleteTickets.getBugCount();
  }

  getDevCompleteStoryPoints() {
    DevCompleteTickets.getStoryPoints();
  }
}
