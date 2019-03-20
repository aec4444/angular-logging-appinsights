import { LoggerMessageTypes } from '@gaf/typescript-interfaces-logging';

export interface AppInsightsLoggerConfig {
  instrumentationKey: string;
  logType: 'event' | 'trace';
  minimumLogLevel?: LoggerMessageTypes;
  autoFlushInterval?: number;
  dataPrefix?: string;
  customProperties?: () => { [key: string]: string };
}
