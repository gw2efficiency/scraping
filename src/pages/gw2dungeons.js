const requester = require('gw2e-requester')
const { buildQueryString } = require('../helpers.js')

// Get the current record times for dungeon runs
async function getDungeonRecords () {
  let records = {}

  // Grab all the info we need from the API
  let specs = await gw2DungeonsApi({type: 'readData'})
  let instances = specs.instances
  let paths = specs.paths
  let options = {
    type: 'records',
    category: 1,
    paths: specs.paths.map(x => x.ID).join('|')
  }
  let data = (await gw2DungeonsApi(options)).records

  // Get a map of all instances for resolving ids -> name
  let instanceMap = {}
  instances.map(x => instanceMap[x.ID] = x.name)

  // Generate an object that has all instances inside
  instances.map(x => records[x.name] = {})

  // Add all paths with their records to that object
  let defaultPath = {seconds: null, url: null, guild: {}}
  paths.map(x => {
    records[instanceMap[x.instance]][x.name] = data[x.ID]
      ? transformRecord(data[x.ID])
      : defaultPath
  })

  return records
}

// Transform a record from gw2dungeons to our format
function transformRecord (record) {
  return {
    seconds: parseInt(record.time, 10) / 1000,
    url: record.topiclink.indexOf('http') === 0 ? record.topiclink : null,
    guild: {
      name: record.groups[0].name,
      tag: record.groups[0].tag
    }
  }
}

// Generate a API call to gw2dungeons
async function gw2DungeonsApi (body) {
  return await requester.single('http://gw2dungeons.net/records.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: buildQueryString(body)
  })
}

module.exports = {getDungeonRecords}
