import { TestBed } from '@angular/core/testing';
import { AppInsightsLoggerService } from './appinsights-logger.service';
import { AppInsightsLoggerModule } from './appinsights-logger.module';
import { LoggerMessageTypes } from '@gaf/typescript-interfaces-logging';
import { AppInsights } from 'applicationinsights-js';
import { AppInsightsLoggerConfig } from './appinsights-logger-config';

describe('AppInsightsLoggerService', () => {
  let service: AppInsightsLoggerService;
  const config: AppInsightsLoggerConfig = {
    autoFlushInterval: 100,
    customProperties: () => {
      return {test: '123'}
    },
    dataAsJson: true,
    dataPrefix: 'data',
    instrumentationKey: '1234',
    logType: 'event',
    minimumLogLevel: 'debug'
  };

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AppInsightsLoggerService, useFactory: () =>
            AppInsightsLoggerModule.constructService(config) }
      ]
    });
    service = TestBed.get(AppInsightsLoggerService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const testProps = (props: {[key:string]:string}, data: any[]) => {
    if (data !== undefined && data !== null && data.length > 0) {
      if (service.config.dataAsJson) {
        data.forEach((item, index) => {
          const key = `${config.dataPrefix}${index}`;
          expect(props[key]).toBe(JSON.stringify(item));
        });
      } else {
        // test the first property of the first element
        const dataKey = Object.keys(data[0])[0];
        console.log(dataKey);
        const key = `${config.dataPrefix}0_${dataKey}`;
        console.log(props);
        expect(props[key]).toBe(data[0][dataKey].toString());
      }
    }
  };

  const logMessageSetup = (
    logType: 'event' | 'trace',
    type: LoggerMessageTypes,
    message: string,
    data?: any[]
  ) => {

    if (type === 'error') {
      spyOn<any>(AppInsights, 'trackException').and.callFake((msg: Error) => {
        expect(msg.message).toBe(message);
      });
    } else {
      const name = (logType === 'event' ? 'trackEvent' : 'trackTrace');
      spyOn<any>(AppInsights, name).and.callFake((msg: string, props: {[key:string]: string}) => {
        expect(msg).toBe(message);
        testProps(props, data);
      });
    }
  }

  const logMessage = (
    logType: 'event' | 'trace',
    type: LoggerMessageTypes,
    message: string,
    ...data: any[]) => {
      service.config.logType = logType;

      logMessageSetup(logType, type, message, data)
      service.write(type, message, ...data);
  };

  const logMessageCallMethod = (
    logType: 'event' | 'trace',
    type: LoggerMessageTypes,
    message: string,
    ...data: any[]) => {
      service.config.logType = logType;

      logMessageSetup(logType, type, message, data)
      service[type](message, ...data);
      jasmine.clock().tick(service.config.autoFlushInterval + 1);
  };

  it('should log an event log', () => {
    logMessage('event', 'log', 'test');
  });

  it('should log a event warn', () => {
    logMessage('event', 'warn', 'test');
  });

  it('should log a event debug', () => {
    logMessage('event', 'debug', 'test');
  });

  it('should log a event info', () => {
    logMessage('event', 'info', 'test');
  });

  it('should log a event error', () => {
    logMessage('event', 'error', 'test');
  });

  it('should log an trace log', () => {
    logMessage('trace', 'log', 'test');
  });

  it('should log a trace warn', () => {
    logMessage('trace', 'warn', 'test');
  });

  it('should log a trace debug', () => {
    logMessage('trace', 'debug', 'test');
  });

  it('should log a trace info', () => {
    logMessage('trace', 'info', 'test');
  });

  it('should log a trace error', () => {
    logMessage('trace', 'error', 'test');
  });

  it('should log an trace log', () => {
    logMessageCallMethod('trace', 'log', 'test');
  });

  it('should log a trace warn', () => {
    logMessageCallMethod('trace', 'warn', 'test');
  });

  it('should log a trace debug', () => {
    logMessageCallMethod('trace', 'debug', 'test');
  });

  it('should log a trace info', () => {
    logMessageCallMethod('trace', 'info', 'test');
  });

  it('should log a trace error', () => {
    logMessageCallMethod('trace', 'error', 'test');
  });

  it('should set authorized user', () => {
    const userName = 'test user';
    spyOn<any>(AppInsights, 'setAuthenticatedUserContext').and.callFake((user: string) => {
      expect(user).toBe(userName);
    });

    service.AuthenticatedUser = userName;
    expect(service.AuthenticatedUser).toBe(userName);
  });

  it('should set authorized user', () => {
    spyOn<any>(AppInsights, 'clearAuthenticatedUserContext').and.callFake(() => {
      expect(service.AuthenticatedUser).toBeNull();
    });

    service.AuthenticatedUser = null;
    expect(service.AuthenticatedUser).toBeNull();
  });

  it('should call assert and log error', () => {
    logMessageSetup('event', 'error', 'test');
    service.assert(false, 'test');
  });

  it('should log and write properties json', () => {
    service.config.dataAsJson = true;
    logMessage('event', 'warn', 'test', {test: 1});
  });

  it('should log and write properties elements', () => {
    service.config.dataAsJson = false;
    logMessage('event', 'warn', 'test', {test: 1});
  });

  it('should handle autoFlush', () => {
    logMessage('event', 'warn', 'test');
  });

  it('should set minimumLogLevel', () => {
    service.minimumLevel = 'error';
    expect(service.minimumLevel).toBe('error');
  });
});
