import { TestBed } from '@angular/core/testing';
import { AppInsightsLoggerService } from './appinsights-logger.service';
import { Logger } from '@gaf/typescript-interfaces-logging';
import { AppInsightsLoggerConfig } from '@gaf/typescript-logging-appinsights';
import { AppInsightsLoggerModule } from './appinsights-logger.module';

describe('AppInsightsLoggerModule', () => {
  let service: AppInsightsLoggerService;
  const config: AppInsightsLoggerConfig = {
    autoFlushInterval: 100,
    customProperties: () => {
      return {test: '123'};
    },
    dataAsJson: true,
    dataPrefix: 'data',
    instrumentationKey: '1234',
    logType: 'event',
    minimumLogLevel: 'debug'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppInsightsLoggerModule.forRoot(config)
      ]
    });
    service = TestBed.get(Logger);
  });

  /**
   * If the service is created, forRoot worked
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
