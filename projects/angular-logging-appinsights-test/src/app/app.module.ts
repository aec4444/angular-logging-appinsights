import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppInsightsLoggerModule } from '@gaf/angular-logging-appinsights';
import { AppComponent } from './app.component';

function getCustomProperties(): { [key: string]: string} {
  return {
    applicationName: 'angular-logging-appinsights-test',
    numberValue: '1234',
    dateValue: (new Date()).toString()
  }
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppInsightsLoggerModule.forRoot({
      instrumentationKey: 'b816c4fe-8de6-4945-a9f7-84a8697f63db',
      logType: 'trace',
      minimumLogLevel: 'info',
      dataAsJson: false,
      dataPrefix: 'test',
      autoFlushInterval: 5000,
      customProperties: getCustomProperties
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
