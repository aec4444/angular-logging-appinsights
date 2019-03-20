import { NgModule, ModuleWithProviders } from '@angular/core';
import { AppInsightsLoggerService } from './appinsights-logger.service';
import { Logger } from '@gaf/typescript-interfaces-logging';
import { AppInsightsLoggerConfig } from './appinsights-logger-config';

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
  ],
  exports: []
})
export class AppInsightsLoggerModule {
  static constructService(
    config: AppInsightsLoggerConfig
  ) {
    const svc = new AppInsightsLoggerService(config);
    return svc;
  }

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
          useFactory: () => this.constructService(config)
        }
      ]
    };
  }
}
