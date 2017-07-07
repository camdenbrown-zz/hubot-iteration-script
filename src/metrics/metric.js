import DevCompleteTickets from './services/retrieveDevCompleteTickets';

export default class Metric {
  constructor() {

  }

  retrieveMetrics() {
    let devCompleteTickets = new DevCompleteTickets();
    return new Promise((resolve, reject) => {
      resolve(devCompleteTickets.updateMetrics());
    });
  }
}
