const express = require('express')
const request = require('request')
const { forEach } = require('p-iteration')
const path = require('path')
const PORT = process.env.PORT || 5000

var online = "<span style='color: " + "#70ff8a" + "'>Online</span>";
var offline = "<span style='color: " + "#ff7070" + "'>Offline</span>";
var servers = [["https://fivem.net/", "Main Webserver"], ["https://servers.fivem.net/", "Server List"], ["https://servers-live.fivem.net/", "Server API", (e, r, b) => {return(!e && !b.includes("Error") && !b.includes("a padding to disable MSIE and Chrome friendly error page"))}], ["https://runtime.fivem.net/", "Runtime"], ["https://metrics.fivem.net/", "Metrics", (e, r, b) => {return(!e && b.includes("Matomo"))}], ["https://forum.fivem.net/", "Forums", (e, r, b) => {return(!e && b.includes("hidden-login-form"))}], ["https://wiki.fivem.net/", "Wiki"], ["https://keymaster.fivem.net/", "Keymaster Server"]];

var app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

app.get('/', (req, res) => {
  var status = [];
  forEach(servers, async (server, i) => {
    await request(server[0], function (error, response, body) {
      if (server[2]) {
        if (server[2](error, response, body)) {
          status.push([server[1], online, i]);
        } else {
          status.push([server[1], offline, i]);
        }
      } else {
        if (!error && !body.includes("Error")) {
          status.push([server[1], online, i]);
        } else {
          status.push([server[1], offline, i]);
        }
      }
      if (status.length == servers.length) {
        status = status.sort((a, b) => {
          if (a[2] > b[2]) {
            return 1;
          } else {
            return -1;
          }
        })
        res.render('pages/index', { status })
      }
    });
  })
})

app.get('/json', (req, res) => {
  var status = [];
  forEach(servers, {timeout: 2000}, async (server, i) => {
    await request(server[0], function (error, response, body) {
      if (server[2]) {
        if (server[2](error, response, body)) {
          status.push([server[1], online, i]);
        } else {
          status.push([server[1], offline, i]);
        }
      } else {
        if (!error && !body.includes("Error")) {
          status.push([server[1], online, i]);
        } else {
          status.push([server[1], offline, i]);
        }
      }
      if (status.length == servers.length) {
        status = status.sort((a, b) => {
          if (a[2] > b[2]) {
            return 1;
          } else {
            return -1;
          }
        })
        res.json(status)
      }
    });
  })
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
