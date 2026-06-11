// srv/analytics-service.cds
using { com.epm as db } from '../db/schema';

service AnalyticsService @(path: '/analytics') {

  // Unbound action — belongs to the service, not an entity
  action GenerateReport(
    reportType : String(20),    // Input parameter
    startDate  : Date,           // Input parameter
    endDate    : Date            // Input parameter
  ) returns {                    // Output
    reportId   : UUID;
    status     : String(20);
    message    : String(200);
  };

  // Another unbound action — no parameters
  action PingHealth() returns {
    status    : String(10);
    timestamp : DateTime;
    version   : String(20);
  };

  @readonly entity ProductCatalog as projection on db.ProductCatalog;
}