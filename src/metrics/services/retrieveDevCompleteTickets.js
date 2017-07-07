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

  updateMetrics() {
    console.log('HIT', jiraIdentifier, projectIdentifier)
    MetovaMetrics.getMetrics({ namespace: "jira", metric: "stories" }, ({ data }) => {
      _buildProjectStatus(data);
      return {
        storyPointCount: this.totalStoryPoints,
        bugCount: this.bugCount
      };
    });
  }

  _buildProjectStatus({ value: ticket }) {
    if(filterIterationDevComplete(ticket)) {
      if(ticket.issue_type === 'Story') {
        this.totalStoryPoints += ticket.story_point_value;
      } else if (ticket.issue_type === 'Bug') {
        this.totalBugCount += 1;
      }
    }
  }

  filterIterationDevComplete(ticket) {
    return ticket.project_key === projectIdentifier
           && (ticket.state === 'completed' || ticket.state === 'accepted')
           && moment(ticket.completed_at).isBetween(previousIterationStartDate, newIterationStartDate);
  }
}
