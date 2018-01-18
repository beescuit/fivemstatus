const request = require('request');
const { forEach } = require('p-iteration');

var online = "<span style='color: " + "#70ff8a" + "'>Online</span>";
var offline = "<span style='color: " + "#ff7070" + "'>Offline</span>";

var status = [];
var ready = false;

var servers = [["https://fivem.net/", "Main Webserver"], ["https://servers.fivem.net/", "Server List"], ["https://servers-live.fivem.net/", "Server API", (e, r, b) => {return(!e && !b.includes("Error") && !b.includes("a padding to disable MSIE and Chrome friendly error page"))}], ["https://runtime.fivem.net/", "Runtime"], ["https://metrics.fivem.net/", "Metrics", (e, r, b) => {return(!e && b.includes("Matomo"))}], ["https://forum.fivem.net/", "Forums", (e, r, b) => {return(!e && b.includes("hidden-login-form"))}], ["https://wiki.fivem.net/", "Wiki"], ["https://keymaster.fivem.net/", "Keymaster Server"], ["https://lambda.fivem.net/", "Lambda"], ["http://crashes.fivem.net/", "Crash server"]];

function poll() {
  tmpstatus = [];
  forEach(servers, async (server, i) => {
    await request(server[0], function (error, response, body) {
      if (server[2]) {
        if (server[2](error, response, body)) {
          tmpstatus.push([server[1], online, i, server[0]]);
        } else {
          tmpstatus.push([server[1], offline, i, server[0]]);
        }
      } else {
        if (!error && !body.includes("Error")) {
          tmpstatus.push([server[1], online, i, server[0]]);
        } else {
          tmpstatus.push([server[1], offline, i, server[0]]);
        }
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
