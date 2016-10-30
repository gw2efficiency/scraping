import fetch from 'lets-fetch'
import cheerio from 'cheerio'

// Get the total achievement leaderboard (top 2000)
export default async function achievementLeaderboard () {
  let regions = ['eu', 'na']
  let pages = 40

  // Generate the request array
  let requests = []
  regions.map(region => {
    for (let i = 1; i <= pages; i++) {
      requests.push('https://leaderboards.guildwars2.com/en/' + region + '/achievements?page=' + i + '&pjax=1')
    }
  })

  // Get all the pages, parse them and concat the results together
  let array = []
  let content = await fetch.many(requests, {type: 'text', waitTime: 300})
  content.map(html => {
    array = array.concat(parseAchievementPage(html))
  })

  // Calculate the rank for each and order by points
  return cleanupLeaderboardArray(array)
}

// Filter, order and calculate the rank
function cleanupLeaderboardArray (array) {
  let unique = []

  // Only use the first occurrence of any account name
  array.map(element => {
    if (array.find(x => x.name === element.name) === element) {
      unique.push(element)
    }
  })

  unique.sort((a, b) => b.points - a.points)
  unique.map((x, i) => {
    unique[i].rank = i + 1
  })

  return unique
}

// Parse the html of a single achievement page into rows
function parseAchievementPage (html) {
  let $ = cheerio.load(html)
  let region = $('#region').val()
  let rows = $('#mainData tbody tr')
  let array = []

  rows.each((i, row) => {
    let regionRank = $(row).find('td.rank .cell-inner').text().trim()
    let name = $(row).find('td.name').text().trim()
    let points = $(row).find('td.achievements .cell-inner').text().trim()
    let since = $(row).find('td.achievements .additional').text().trim()
    let world = $(row).find('td.world').text().trim()

    array.push({
      regionRank: parseInt(regionRank, 10),
      name: name,
      points: parseInt(points, 10),
      lastChange: parseTimestring(since),
      world: world,
      region: region
    })
  })

  return array
}

// Parse a timestring "Since ..." into a standard format
function parseTimestring (string) {
  string = string.replace(/^[\d]*/, '')
  let date = new Date(string)
  return date.toString()
}
