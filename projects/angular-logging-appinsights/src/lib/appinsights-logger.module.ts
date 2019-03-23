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
  static forRoot(
    config: AppInsightsLoggerConfig
  ): ModuleWithProviders {
    return {
      ngModule: AppInsightsLoggerModule,
      providers: [
        {
          provide: Logger,
          useFactory: () => new AppInsightsLoggerService(config)
        }
      ]
    };
  }
}
