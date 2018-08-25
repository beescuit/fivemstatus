const rp = require('request-promise-native')

let status = []
let servers = require('./servers.json')

async function poll () {
  status = await Promise.all(servers.map(async ({url, name}) => {
    let response = await rp.head({url, simple: false, resolveWithFullResponse: true, timeout: 5000, time: true}).catch(e => e)
    let online = (response.statusCode === 200 || response.statusCode === 404) ? response.elapsedTime : false
    return {url, name, online}
  }))
}

function start () {
  poll()
  setInterval(poll, 60000)
}

function getStatus () {
  return status
}

module.exports = {start, getStatus}
