var http = require('http');
var url = require('url');
var compress = require('json-compressor');
function readConfig(opts, cb){
  // Sets the url or uses the default ec2 variant
  var dataurl = url.parse(opts.userdata_url || 'http://169.254.169.254/1.0/user-data');
  var reqopts =  { hostname: dataurl.hostname, path: dataurl.path, method: 'GET'}
  // The key to use in the user data blob that reflects the config must be root level
  var key = opts.key || 'app_config';
  var is_finished = false; 
  var req = http.request(reqopts, function(res){
    console.log("got res"); 
    res.setEncoding('utf8');
    var result = ''; 
    res.on('data', function(chunk){
      result += chunk;
    });
    res.on('end', function(){
      try{
        var user_data = JSON.parse(compress(result));
        if(user_data[key]) return cb( user_data[key]);
        
        return cb( opts.backup || null);
      }catch(e){
        console.log('JSON.parse failed, using backup');
      }
      return cb( opts.backup || null);
    });
  });

  req.on('error', function(e){
    // If there is an error with the request, then we use the backup config
    // Its possible this machine is a dev instance that doesn't use ec2 or openstack metadata
    
    return cb(opts.backup || null);
  });
  req.end();
}

var config = null;

exports.getConfig = function(){
  return config;
}

exports.readConfig = function(opts, cb){
  readConfig(opts, function(c){
    config = c
    return cb(c);
  });
}
