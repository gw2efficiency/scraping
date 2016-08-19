const requester = require('gw2e-requester')
const {buildQueryString} = require('../helpers.js')

const whitelist = [
  'Spirit Vale',
  'Salvation Pass',
  'Stronghold of the Faithful',
  'Fractals of the Mists',
  'Ascalonian Catacombs',
  'Caudecus\'s Manor',
  'Twilight Arbor',
  'Sorrow\'s Embrace',
  'Citadel of Flame',
  'Honor of the Waves',
  'Crucible of Eternity',
  'The Ruined City of Arah'
]

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

  return filterRecords(records)
}

// Filter an object by key
function filterRecords (obj) {
  let result = {}

  for (var key in obj) {
    if (whitelist.indexOf(key) !== -1) {
      result[key] = obj[key]
    }
  }

  return result
}

// Transform a record from gw2dungeons to our format
function transformRecord (record) {
  if (record.groups.length == 0) {
    record.groups = [{name: 'Unknown', tag: '????'}]
  }

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
  return await requester.single('http://gw2dungeons.com/records.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: buildQueryString(body)
  })
}

module.exports = {getDungeonRecords}
