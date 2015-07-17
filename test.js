'use strict'

var dgram = require('dgram')
var Lab   = require('lab')
var Code  = require('code')
var EE    = require('events').EventEmitter

var lab = module.exports.lab = Lab.script()

var describe  = lab.describe
var it        = lab.it
var before    = lab.before
var expect    = Code.expect

var logger = require('./')

describe('logger', function() {

  describe('method initialization', function() {

    it('without options', function(done) {
      var log = logger('logstash://127.0.0.1:9000')
      expect(log.fields.name).to.equal('bunyan-child')
      done()
    })

    it('with options', function(done) {
      var log = logger({name: 'test'}, 'logstash://127.0.0.1:9000')
      expect(log.fields.name).to.equal('test')
      done()
    })

    it('without arguments', function(done) {
      var log = logger()
      expect(log.fields.name).to.equal('bunyan-child')
      done()
    })

  })

  describe('unit test', function() {
    var server
    var log

    before(function(done) {
      // the server will be listening and then call `done`
      server = mockUdp(4578, done)
    })

    it('simulating send logs to logstash from the primary logger',
    function(done) {
      log = logger({name: 'test'}, 'logstash://127.0.0.1:4578')

      log.info('this is a test')

      server.once('data', function(data) {
        expect(data).to.be.buffer()
        var obj = JSON.parse(data.toString())
        expect(obj.name).to.equal('test')
        expect(obj.message).to.equal('this is a test')
        done()
      })
    })

    it('simulating send logs to logstash from the child logger',
    function(done) {
      var child = log.child({type: 'child_logger'})

      child.info('this is a test from child logger')

      server.once('data', function(data) {
        expect(data).to.be.buffer()
        var obj = JSON.parse(data.toString())
        expect(obj.name).to.equal('test')
        expect(obj.message).to.equal('this is a test from child logger')
        expect(obj.type).to.equal('child_logger')
        done()
      })
    })

    it('send logs only to process.stdout', function(done) {
      log = logger()

      log.info('this is a test')

      server.once('data', function() {
        throw 'shouldn\'t enter in here'
      })

      setTimeout(done, 500)
    })
  })

})

//
// helper function to create the UDP mock
//

function mockUdp (port, cb) {
  var ee = new EE()
  var server = dgram.createSocket('udp4')

  function message (data) {
    ee.emit('data', data)
  }

  function close () {
    ee.emit('close')
  }

  function error (err) {
    ee.emit('error', err)
  }

  server.on('message', message)
  server.on('listening', cb)
  server.on('close', close)
  server.on('error', error)

  server.bind(port, '127.0.0.1')

  return ee
}
