var assert = require('assert');
var static = require('node-static');

var config = require('./index');
var http = require("http");
var fileServer = new static.Server('./configs');




describe('metadata configuration', function(){
  before(function(done){
    http.createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    }).listen(8080, function(){
    done(); 
    });
  });
  it('readConfig and getConfig bad json fails over to backup', function(done){
    var opts =  {userdata_url: 'http://localhost:8080/bad.json', backup: { db : 'test'}};
    config.readConfig(opts, function(conf){
      assert.equal(conf.db, 'test');
      var c = config.getConfig();
      assert.equal(c, conf);
      assert.ok(conf._failed);
      done();
    });
  });
  it('readConfig and getConfig good json returns good json', function(done){
    var opts =  {userdata_url: 'http://localhost:8080/good.json', backup: { db : 'test'}};
    config.readConfig(opts, function(conf){
      assert.equal(conf.db, 'cloud');
      var c = config.getConfig();
      assert.equal(c, conf);
      assert.ok(!conf._failed);
      done();
    });
  });
  it('readConfig will return backup if metadata service is down, or url is unreachable', function(done){
    var opts =  {userdata_url: 'http://localhost:8081/good.json', backup: { db : 'test'}};
    config.readConfig(opts, function(conf){
      assert.equal(conf.db, 'test');
      var c = config.getConfig();
      assert.equal(c, conf);
      assert.ok(conf._failed);
      done();
    });
  });
  it('readConfig will return backup if metadata service is down, or url is missing 404', function(done){
    var opts =  {userdata_url: 'http://localhost:8080/doestexist.json', backup: { db : 'test'}};
    config.readConfig(opts, function(conf){
      assert.equal(conf.db, 'test');
      var c = config.getConfig();
      assert.equal(c, conf);
      assert.ok(conf._failed);
      done();
    });
  });

});
