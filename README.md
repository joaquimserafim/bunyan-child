# bunyan-child

create a primary instance of a bunyan logger and many `child` instances from the primary and with support to send the logs to logstash

<a href="https://nodei.co/npm/bunyan-childr/"><img src="https://nodei.co/npm/bunyan-child.png?downloads=true"></a>

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://travis-ci.org/joaquimserafim/bunyan-child)![Code Coverage 100%](https://img.shields.io/badge/code%20coverage-100%25-green.svg?style=flat-square)[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://github.com/joaquimserafim/bunyan-child/blob/master/LICENSE)


## API
```js
var logger = require('bunyan-child')
```

*   **options** {}, configure bunyan options, non required
*   **logstash URI** string, address and port for logstash and enables the use of logstash, non required

## Usage

```js

var log = logger({name: 'MYLOG'}, 'logstash://127.0.0.1:9000')

log.info('hello world')

// in a sub-component of your application

var subLog = log.child({type: 'some_op'})

subLog.info('hello world from the sub-component')

```


### Development

##### this projet has been set up with a precommit that forces you to follow a code style, no jshint issues and 100% of code coverage before commit


to run test
``` js
npm test
```

to run jshint
``` js
npm run jshint
```

to run code style
``` js
npm run code-style
```

to run check code coverage
``` js
npm run check-coverage
```

to open the code coverage report
``` js
npm run open-coverage
```
