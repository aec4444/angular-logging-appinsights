import { Injectable } from '@angular/core';
import { AppInsightsLogger, AppInsightsLoggerConfig } from '@gaf/typescript-logging-appinsights';

@Injectable()
export class AppInsightsLoggerService extends AppInsightsLogger {
  constructor(private _config: AppInsightsLoggerConfig) {
    super(_config);
  }
}
