var assert = require('assert');
var static = require('node-static');

var config = require('./index');
var http = require("http");
var file = new static.Server('./configs');

http.createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(8080);




describe('metadata configuration', function(){
  it('readConfig and getConfig bad json fails over to backup', function(){
    var opts =  {url: 'http://localhost:8080/bad.json', backup: { db : 'test'}};
    config.readConfig(opts, function(conf){
      console.log('got config', conf); 
      assert.equal(conf.db, 'test');
      var c = config.getConfig();
      assert.equal(c, conf);
      done();
    });
  });
  it('readConfig and getConfig good json returns good json', function(done){
    var opts =  {url: 'http://localhost:8080/good.json', backup: { db : 'test'}};
    config.readConfig(opts, function(conf){
      console.log('got config', conf); 
      assert.equal(conf.db, 'test');
      var c = config.getConfig();
      assert.equal(c, conf);
      done();
    });
  });
  it('readConfig will return backup if metadata service is down, or url is unreachable', function(done){
    var opts =  {url: 'http://localhost:8081/good.json', backup: { db : 'test'}};
    config.readConfig(opts, function(conf){
      console.log('got config', conf); 
      assert.equal(conf.db, 'test');
      var c = config.getConfig();
      assert.equal(c, conf);
      done();
    });
  });
  it('readConfig will return backup if metadata service is down, or url is missing 404', function(done){
    var opts =  {url: 'http://localhost:8080/doestexist.json', backup: { db : 'test'}};
    config.readConfig(opts, function(conf){
      console.log('got config', conf); 
      assert.equal(conf.db, 'test');
      var c = config.getConfig();
      assert.equal(c, conf);
      done();
    });
  });

});
