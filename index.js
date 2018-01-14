const express = require('express')
const request = require('request')
const path = require('path')
const PORT = process.env.PORT || 5000

var status = {};

var app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

var green = "#7ff086";
var red = "#f17f7f";

// Before saying anything, I know I should have used a for loop

app.get('/', (req, res) =>{
  request('https://fivem.net/', {timeout: 2000}, function (error, response, body) {
    if (!error && !body.includes("Error")) {
      status.main = "<span style='color: " + green + "'>Online</span>";
    } else {
      status.main = "<span style='color: " + red + "'>Offline</span>";
    }
    request('https://servers.fivem.net/', {timeout: 2000}, function (error, response, body) {
      if (!error && !body.includes("Error")) {
        status.servers = "<span style='color: " + green + "'>Online</span>";
      } else {
        status.servers = "<span style='color: " + red + "'>Offline</span>";
      }
      request('https://keymaster.fivem.net/', {timeout: 2000}, function (error, response, body) {
        if (!error && !body.includes("Error")) {
          status.keymaster = "<span style='color: " + green + "'>Online</span>";
        } else {
          status.keymaster = "<span style='color: " + red + "'>Offline</span>";
        }
        request('https://servers-live.fivem.net/', {timeout: 2000}, function (error, response, body) {
          if (!error && !body.includes("Error") && !body.includes("a padding to disable MSIE and Chrome friendly error page")) {
            status.serverapi = "<span style='color: " + green + "'>Online</span>";
          } else {
            status.serverapi = "<span style='color: " + red + "'>Offline</span>";
          }
          request('https://runtime.fivem.net/', {timeout: 2000}, function (error, response, body) {
            if (!error && !body.includes("Error")) {
              status.runtime = "<span style='color: " + green + "'>Online</span>";
            } else {
              status.runtime = "<span style='color: " + red + "'>Offline</span>";
            }
            request('https://metrics.fivem.net/', {timeout: 2000}, function (error, response, body) {
              if (!error && body.includes("Matomo")) {
                status.metrics = "<span style='color: " + green + "'>Online</span>";
              } else {
                status.metrics = "<span style='color: " + red + "'>Offline</span>";
              }
              request('https://forum.fivem.net/', {timeout: 2000}, function (error, response, body) {
                if (!error && body.includes("hidden-login-form")) {
                  status.forum = "<span style='color: " + green + "'>Online</span>";
                } else {
                  status.forum = "<span style='color: " + red + "'>Offline</span>";
                }
                request('https://wiki.fivem.net/', {timeout: 2000}, function (error, response, body) {
                  if (!error && !body.includes("Error")) {
                    status.wiki = "<span style='color: " + green + "'>Online</span>";
                  } else {
                    status.wiki = "<span style='color: " + red + "'>Offline</span>";
                  }
                  res.render('pages/index', { status })
                });
              });
            });
          });
        });
      });
    });
  });
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
