import { NgModule, ModuleWithProviders } from '@angular/core';
import { AppInsightsLoggerService } from './appinsights-logger.service';
import { Logger } from '@gaf/typescript-interfaces-logging';
import { AppInsightsLoggerConfig } from '@gaf/typescript-logging-appinsights';

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
  ],
  exports: []
})
export class AppInsightsLoggerModule {
  static forRoot(
    config: AppInsightsLoggerConfig
  ): ModuleWithProviders {

    function appInsightsLoggerServiceFactory() {
      const svc = new AppInsightsLoggerService(config);
      return svc;
    }

    return {
      ngModule: AppInsightsLoggerModule,
      providers: [
        {
          provide: Logger,
          useFactory: appInsightsLoggerServiceFactory
        }
      ]
    };
  }
}
