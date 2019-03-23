# @gaf/angular-logging-appinsights

This service allows for logging to Application Insights.  It supports the same "console" interface as other @gaf loggers.  It will allow custom data items to be sent to the logger and also allows for application level custom data to be sent during each request via a callback function.

## Configuration

### Configuration Options

Below describes the configuration options available.

| Option  | Values  | Description
|---|---|---|---|---|
| instrumentationKey  | string  | The instrumentationKey to connect to Application Insights (required)
| logType  | 'event' or 'trace'  | The type of log entry to write (required)
| minimumLogLevel | LoggerMessageTypes | The minimum log severity to write.  The default is 'warn'
| autoFlushInterval  | number  | The number of millseconds to wait until flushing the queue.  If not set, the queue will be flushed at page unload.
| dataPrefix | string | The prefix to use when logging custom data with your log.  If not set, '' will be used as default
| dataAsJson | boolean | If true, this will log each custom data element as JSON.  If false, it will walk each item in an object and log each property as a separate property in application insights.
| customProperties | () => () => { [key: string]: string } | A function that is called during each log entry to get custom properties for the application.

### dataAsJson examples

Below is an example log entry and what the data will look like based on the values of dataAsJson.

``` javascript
this.logger.warn('this is a test', {field1: '1', field2: '2', field3: {subfield1: 'test'}}, 5, {item: 1})
```

#### dataAsJson = true

The application insights data will look like this, assuming dataPrefix = 'data'

| Key | Value
|---|---|
| data0 | {field1: '1', field2: '2', field3: {subfield1: 'test'}}
| data1 | 5
| data2 | {item: 1}

#### dataAsJson = false

The application insights data will look like this, assuming dataPrefix = 'data'

| Key | Value
|---|---|
| data0_field1 | '1'
| data0_field2 | '2'
| data0_field3_subfield1 | 'test'
| data1 | 5
| data2_item | 1

### forRoot configuration

If only one AppInsightsLogger is necessary, and it is going to be used as a stand-alone object (not with @gaf/angular-logging-manager), you can configure using forRoot.  

Below is an example:

``` javascript
    AppInsightsLoggerModule.forRoot({
      instrumentationKey: 'xyz',
      logType: 'trace',
      minimumLogLevel: 'info',
      dataAsJson: false,
      dataPrefix: 'test',
      autoFlushInterval: 5000,
      customProperties: getCustomProperties
    })
```

### Service Instantiation

If you wish to configure multiple services for app insights, or wish to use @gaf/angular-logging-manager, you can simply instantiate a copy of the service

Below is an example:

``` javascript
providers: [
  { provide: Logger, useFactory: () =>
      new AppInsightsLoggerService(
        instrumentationKey: 'xyz',
        logType: 'trace',
        minimumLogLevel: 'info',
        dataAsJson: false,
        dataPrefix: 'test',
        autoFlushInterval: 5000,
        customProperties: getCustomProperties
      )
  }
]
