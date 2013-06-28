# metaconfig

Gets configurations from metadata services running on ec2 or openstack,
and has a fallback for when those services aren't available (Like on
your dev system)

Console logs when it uses backup, and lets you know why its using backup


[![Build
Status](https://travis-ci.org/bryanpaluch/metaconfig.png?branch=master)](https://travis-ci.org/bryanpaluch/metaconfig)

# Example

``` javascript

var config = require('metaconfig');

var opts =  { backup: { db : 'test'}};
config.readConfig(opts, function(conf){
  console.log(conf);
  startApp();
});

function startApp(){
  var c = config.getConfig();
  console.log(c);
  // Config is cached after readConfig!
});

```

# methods

metaconfig is very small, one async function for reading from metadata
service and one for getting a cached version

## readConfig(opts, cb)

Reads in the configuration from the meta data service, by default it
uses http://169.254.169.254/1.0/user-data , but you can use a different
url by passing it the option userdata_url .
ReadConfig expects a json string from the metadata service with the
config stored at key "app_config"; This can be changed by passing the
key option. 

ReadConfig will cache the configuration until readConfig is called
again.

## getConfig()
Sync function returns the cached configuration

## userdata example

``` javascript
{
  "app_name" : "nova-metadata-test",
  "version" : "0.0.1",
  "app_config": {
      "memory" :  "10.255.132.191",
        "db" : "cloud"
  }
}
```

