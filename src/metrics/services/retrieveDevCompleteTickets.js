import MetovaMetrics from 'metova-metrics';
import Moment from 'moment';
const jiraIdentifier = process.env.JIRA_IDENTIFIER;
const projectIdentifier = process.env.PROJECT_IDENTIFIER;
const previousIterationStartDate = Moment().startOf('isoWeek').subtract(3, 'days').startOf('day');
const newIterationStartDate = Moment().startOf('isoWeek').add(4, 'days');

export default class DevCompleteTickets {
  constructor() {
    this.totalStoryPoints = 0;
    this.totalBugCount = 0;
  }

    updateMetrics();
  }

  getStoryPoints() {
    return this.totalStoryPoints;
  }

  getBugCount() {
    return this.totalBugCount;
  }

  _updateMetrics() {
    this.totalBugCount = 0;
    this.totalStoryPoints = 0;
    MetovaMetrics.getMetrics({ namespace: "jira", metric: "stories" }, ({ data }) => {
      data.forEach(buildProjectStatus);
    });
  }

  _buildProjectStatus(data) {
    let ticket = data.value;

    if(filterIterationDevComplete(data)) {
      if(ticket.issue_type === 'Story') {
        this.totalStoryPoints += ticket.story_point_value;
      } else if (ticket.issue_type === 'Bug') {
        this.totalBugCount += 1;
      }
    }
  }

  filterIterationDevComplete({ value: ticket }) {
    return ticket.project_key === projectIdentifier
           && (ticket.state === 'completed' || ticket.state === 'accepted')
           && moment(ticket.completed_at).isBetween(previousIterationStartDate, newIterationStartDate);
  }
}
