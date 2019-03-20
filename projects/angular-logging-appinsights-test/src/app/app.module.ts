import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppInsightsLoggerModule } from '@gaf/angular-logging-appinsights';
import { AppComponent } from './app.component';

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
      autoFlushInterval: 5000
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
