import { Injectable } from '@angular/core';
import { AppInsightsLoggerConfig } from './appinsights-logger-config';
import { AppInsights } from 'applicationinsights-js';
import { LoggerMessageTypes, Logger } from '@gaf/typescript-interfaces-logging';

enum SeverityLevel {
  Verbose = 0,
  Information = 1,
  Warning = 2,
  Error = 3,
  Critical = 4
}

@Injectable()
export class AppInsightsLoggerService extends Logger {
  private _userId: string;
  private _timeoutToken: any;

  private _defaultConfig: AppInsightsLoggerConfig = {
    instrumentationKey: '',
    logType: 'event',
    minimumLogLevel: 'warn',
    dataPrefix: '',
    dataAsJson: true
  };

  constructor(public config: AppInsightsLoggerConfig) {
    super();

    this.config = Object.assign({}, this._defaultConfig, this.config);

    if (config) {
      if (config.instrumentationKey) {
        AppInsights.downloadAndSetup({
          instrumentationKey: this.config.instrumentationKey
        });
      }

      this._setupAutoFlush();
    }
  }

  //#region Auto Flush
  private _setupAutoFlush() {
    if (
      this._timeoutToken === undefined &&
      this.config.autoFlushInterval !== undefined &&
      this.config.autoFlushInterval !== null
    ) {
      this._timeoutToken = setTimeout(
        () => this._handleAutoFlush(),
        this.config.autoFlushInterval
      );
    }
  }

  private _handleAutoFlush() {
    this._timeoutToken = undefined;
    AppInsights.flush();
  }
  //#endregion

  //#region Authorized User
  public get AuthenticatedUser(): string {
    return this._userId;
  }

  public set AuthenticatedUser(value: string) {
    this._userId = value;

    if (
      this._userId !== undefined &&
      this._userId !== null &&
      this._userId !== ''
    ) {
      AppInsights.setAuthenticatedUserContext(this._userId, undefined, true);
    } else {
      AppInsights.clearAuthenticatedUserContext();
    }
  }
  //#endregion

  assert(assertion: boolean, message: string, ...data: any[]) {
    super.assert(assertion, message, data);
  }

  /**
   * Write log entry
   * @param type Type of log message to write
   * @param message The message to send
   * @param data Any supporting data to send with the request
   */
  write(type: LoggerMessageTypes, message: string, ...data: any[]) {
    this._write(type, message, data);
  }

  private _write(type: LoggerMessageTypes, message: string, data?: any[]) {
    // handle error differently
    if (this.shouldLog(type)) {
      if (type === 'error') {
        this.error(message, data);
      } else {
        // now we have the severity which we may need
        // turn the data into values
        const properties = this.convertDataToProperties(data);

        if (this.config.logType === 'event') {
          this.logEvent(message, properties);
        } else {
          let sev: SeverityLevel = SeverityLevel.Information;

          switch (type) {
            case 'warn':
              sev = SeverityLevel.Warning;
              break;
            case 'debug':
              sev = SeverityLevel.Verbose;
              break;
          }

          this.logTrace(message, properties, sev);
        }
      }
    }
  }

  //#region Event, Trace or Exception helper functions
  private logEvent(
    name: string,
    properties?: { [key: string]: string },
    measurements?: { [key: string]: number }
  ) {
    AppInsights.trackEvent(
      name,
      this.getCustomProperties(properties),
      measurements
    );
    this._setupAutoFlush();
  }

  private logTrace(
    name: string,
    properties?: { [key: string]: string },
    severityLevel?: SeverityLevel
  ) {
    AppInsights.trackTrace(
      name,
      this.getCustomProperties(properties),
      severityLevel
    );
    this._setupAutoFlush();
  }

  private logException(
    error: Error,
    properties?: { [key: string]: string },
    measurements?: { [key: string]: number }
  ) {
    AppInsights.trackException(
      error,
      null,
      this.getCustomProperties(properties),
      measurements
    );
    this._setupAutoFlush();
  }

  /**
   * Converts data into a <string,string> dictionary
   * @param data The data passed into the logging method
   */
  private convertDataToProperties(data: any[]): { [key: string]: string } {
    if (data === undefined || data === null || data.length === 0) {
      return undefined;
    }

    // write JSON of each element in data if it is an object, otherwise, write string representation
    const result = {};
    data.forEach((item, index) => {
      this.convertDataToPropertiesItem(
        result,
        item,
        `${this.config.dataPrefix || ''}${index}`
      );
    });

    return result;
  }

  /**
   * Place a value into the properties dictionary
   * @param result The resulting <string,string> dictionary
   * @param item item to parse
   * @param prefix prefix portion of the key to use
   */
  private convertDataToPropertiesItem(
    result: { [key: string]: string },
    item: any,
    prefix: string
  ) {
    if (typeof item === 'object') {
      if (this.config.dataAsJson) {
        result[prefix] = item ? JSON.stringify(item) : null;
      } else {
        Object.keys(item).forEach(key => {
          this.convertDataToPropertiesItem(
            result,
            item[key],
            `${prefix}_${key}`
          );
        });
      }
    } else {
      result[prefix] =
        item !== undefined && item !== null ? item.toString() : null;
    }
  }

  /**
   * Call custom function to get high level properties and combine them with the results
   * @param properties Properties collected from the call to the logger
   */
  private getCustomProperties(properties?: {
    [key: string]: string;
  }): { [key: string]: string } {
    if (typeof this.config.customProperties === 'function') {
      const customProperties = this.config.customProperties();
      if (customProperties !== undefined && customProperties !== null) {
        properties = this.mergeObjects(properties || {}, customProperties);
      }
    }

    return properties;
  }

  /**
   * ES5 friendly, replacing spread operator
   */
  private mergeObjects(...items: any[]): { [key: string]: string } {
    const result = {};

    if (items !== undefined && items !== null && items.length > 0) {
      items.forEach(item => {
        const keys = Object.keys(item);
        keys.forEach(key => {
          result[key] = item[key];
        });
      });
    }

    return result;
  }

  //#endregion

  //#region Logging Methods
  info(message: string, ...data: any[]): void {
    this._write('info', message, data);
  }

  log(message: string, ...data: any[]): void {
    this._write('log', message, data);
  }

  warn(message: string, ...data: any[]): void {
    this._write('warn', message, data);
  }

  error(message: string | Error, ...data: any[]): void {
    const properties = this.convertDataToProperties(data);
    const error =
      message instanceof Error ? (message as Error) : new Error(message);
    this.logException(error, properties);
  }

  debug(message: string, ...data: any[]): void {
    this._write('debug', message, data);
  }
  //#endregion
}
