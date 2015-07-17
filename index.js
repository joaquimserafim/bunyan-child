'use strict'

var bunyan  = require('bunyan')
var parse   = require('url').parse
var extend  = require('util')._extend

//
//
//

module.exports = logger

function logger (opts, logstashUri) {
  if (typeof opts === 'string') {
    logstashUri = opts
    opts        = {}
  }

  var streams = [{stream: process.stdout, level: 'info'}]

  if (logstashUri) {
    var uriObj = parse(logstashUri)

    streams.push(
      {
        type  : 'raw',
        stream: require('bunyan-logstash').createStream(
          {
            host: uriObj.hostname,
            port: uriObj.port,
            level: 'info'
          }
        )
      }
    )
  }

  return bunyan.createLogger(
    extend({streams: streams, name: 'bunyan-child'}, opts)
  )
}
