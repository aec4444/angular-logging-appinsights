import { LoggerMessageTypes } from '@gaf/typescript-interfaces-logging';

export interface AppInsightsLoggerConfig {
  instrumentationKey: string;
  logType: 'event' | 'trace';
  minimumLogLevel?: LoggerMessageTypes;
  autoFlushInterval?: number;
  dataPrefix?: string;
  dataAsJson?: boolean;
  customProperties?: () => { [key: string]: string };
}
