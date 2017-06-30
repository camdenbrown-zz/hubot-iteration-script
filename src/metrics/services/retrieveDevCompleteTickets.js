import MetovaMetrics from 'metova-metrics';
import { Moment } from 'moment';

export default class DevCompleteTickets() {
  const thirtyMinutes = 30 * 60 * 1000;
  const previousIterationStartDate = moment().startOf('isoWeek').subtract(3, 'days').startOf('day');
  const newIterationStartDate = moment().startOf('isoWeek').add(4, 'days');
  let totalStoryPoints = 0;
  let totalBugCount = 0;

  constuctor() {
    updateMetrics();
    setInterval(updateMetrics, thirtyMinutes);
  }

  getStoryPoints() {
    return totalStoryPoints;
  }

  getBugCount() {
    return totalBugCount;
  }

  const updateMetrics = () => {
    totalBugCount = 0;
    totalStoryPoints = 0;
    MetovaMetrics.getMetrics({ namespace: "jira", metric: "stories" }, ({ data }) => {
      data.forEach(buildProjectStatus);
    });
  }

  const buildProjectStatus = (data) => {
    let ticket = data.value;

    if(filterIterationDevComplete(data)) {
      if(ticket.issue_type === 'Story') {
        totalStoryPoints += ticket.story_point_value;
      } else if (ticket.issue_type === 'Bug') {
        totalBugCount += 1;
      }
    }
  }

  const filterIterationDevComplete = ({ value: ticket }) => {
    return ticket.project_key === process.env.PROJECT_IDENTIFIER
           && (ticket.state === 'completed' || ticket.state === 'accepted')
           && moment(ticket.completed_at).isBetween(previousIterationStartDate, newIterationStartDate);
  }
}
