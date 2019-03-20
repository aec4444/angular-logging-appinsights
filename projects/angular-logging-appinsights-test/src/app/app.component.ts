import { Component } from '@angular/core';
import { Logger } from '@gaf/typescript-interfaces-logging';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-logging-appinsights-test';

  constructor(private logger: Logger) {
  }

  writeLog() {
    this.logger.log('test log without params');
    this.logger.warn('test warning', {test: 1, hello: 2, list: {listItem: 'hello'}});
  }

  writeError() {
    this.logger.error('test error without params');
    this.logger.error('test error', {param1: 'test'});
  }
}
