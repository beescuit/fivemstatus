const request = require('request');
const { forEach } = require('p-iteration');

var status = [];
var ready = false;

var servers = [["https://fivem.net/", "Main Webserver"], ["https://servers.fivem.net/", "Server List"], ["https://servers-live.fivem.net/api/servers/proto", "Server API"], ["https://runtime.fivem.net/", "Runtime"], ["https://metrics.fivem.net/", "Metrics"], ["https://forum.fivem.net/", "Forums"], ["https://wiki.fivem.net/", "Wiki"], ["https://keymaster.fivem.net/", "Keymaster Server"], ["https://lambda.fivem.net/", "Lambda"]];

function poll() {
  tmpstatus = [];
  forEach(servers, async (server, i) => {
    request(server[0], {timeout: 5000, time : true}, function (error, response) {
      if (!error && (response.statusCode == 200 || response.statusCode == 404)) {
        tmpstatus.push([server[1], `<span style='color: #70ff8a'>Online (${response.elapsedTime}ms</span>` , i]);
      } else {
        tmpstatus.push([server[1], `<span style='color: #ff7070'>Offline</span>`, i]);
      }
      if (tmpstatus.length == servers.length) {
        tmpstatus = tmpstatus.sort((a, b) => {
          if (a[2] > b[2]) {
            return 1;
          } else {
            return -1;
          }
        })
        status = tmpstatus;
        ready = true;
      }
    });
  })
}

function start() {
  poll();
  setInterval(poll, 60000);
}

function getStatus() {
  if (ready) {
    return status;
  } else {
    return [];
  }
}

module.exports = {start, getStatus};
