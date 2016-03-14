/* eslint-env node, mocha */
let requester = require('gw2e-requester')
let cheerio = require('cheerio')
let { buildUrl, matchAll } = require('../helpers.js')

// Get the current claim ticket offers
async function claimTicketOffers () {
  let page = await getWikiMarkup('Black Lion Weapons Specialist (The Vaults)')
  let regex = /item *= *([^|]*?) *\| *cost *= *([\d]*) *Black Lion Claim Ticket(?! Scrap)/gi
  let matches = matchAll(regex, page)
  let map = {}
  matches.map(x => map[x[1]] = parseInt(x[2], 10))
  return map
}

// Get the dye categories
async function dyeCategories () {
  let page = await getWikiHtml('Dye')
  let $ = cheerio.load(page)

  // Get the dye table after the given ID
  function mapDyeTable (id) {
    let map = {}
    let sets = $('#' + id).parent().nextUntil('h3', 'table').find('table')
    sets.each((i, set) => {
      let setTitle = $(set).find('a').first().text()
      let setColors = $(set).find('img')
      setColors.each((i, color) => map[$(color).attr('alt')] = setTitle)
    })
    return map
  }

  let materials = mapDyeTable('By_Material')
  let sets = mapDyeTable('By_Set')
  let colors = mapDyeTable('By_Color')
  return {materials, sets, colors}
}

// Get the miniature sets
async function miniSets () {
  let page = await getWikiHtml('Miniature')
  let $ = cheerio.load(page, {ignoreWhitespace: false})
  let map = {}

  // Parse a simple table (heading -> all minis)
  function simpleTable (table, setTitle) {
    let setMiniatures = $(table).find('a')
    setMiniatures.each((i, mini) => map[$(mini).attr('title')] = setTitle)
  }

  // Parse a extended table (heading per table row)
  function extendedTable (table) {
    let tableRows = $(table).find('tr')
    let lastTitle
    tableRows.each((i, row) => {
      if (i === 0) {
        return
      }

      // Replace breaks with spaces so we can have nice headings
      $(row).find('br').replaceWith($('<span> </span>'))

      // Get the title and the mini off the row
      let setTitle = $(row).find('th').text().trim()
      let setMiniature = $(row).find('td').first().find('a').attr('title')

      // If no title is set, use the one of the previous row
      if (setTitle !== '') {
        lastTitle = setTitle
      } else {
        setTitle = lastTitle
      }

      map[setMiniature] = setTitle
    })
  }

  // Parse all headings and the tables after them
  let headings = $('h3 .mw-headline')
  headings.each((i, heading) => {
    let setTitle = $(heading).text()
    let table = $(heading).parent().nextUntil('h3', 'table')

    // If the table has more than 4 headings, the headings
    // are in the rows, and we need to parse an extended table
    if (table.find('th').length === 4) {
      simpleTable(table, setTitle)
    } else {
      extendedTable(table)
    }
  })

  return map
}

// Get the picture of an item
async function itemPicture (item) {
  let markup = await getWikiMarkup(item)
  let matches = /gallery1 = ([^\n\|]*)/.exec(markup)
  let image = matches !== null ? matches[1] : item + '.jpg'
  return await getWikiImage(image)
}

// Get the wiki markup for the given title
async function getWikiMarkup (title) {
  let url = buildUrl('http://wiki.guildwars2.com/api.php', {
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    format: 'json',
    titles: title
  })
  let content = await requester.single(url)
  let pageId = Object.keys(content.query.pages)[0]
  return content.query.pages[pageId].revisions[0]['*']
}

// Get the wiki html for the given title
async function getWikiHtml (title) {
  let url = 'http://wiki.guildwars2.com/wiki/' + encodeURIComponent(title)
  return await requester.single(url, {type: 'text'})
}

// Get the image url of a image file name
async function getWikiImage (file) {
  let url = buildUrl('http://wiki.guildwars2.com/api.php', {
    action: 'query',
    prop: 'imageinfo',
    iiprop: 'timestamp|user|url',
    format: 'json',
    titles: 'File:' + file
  })
  let content = await requester.single(url)
  let pageId = Object.keys(content.query.pages)[0]
  let imageinfo = content.query.pages[pageId].imageinfo
  return imageinfo ? imageinfo[0]['url'] : null
}

module.exports = {claimTicketOffers, dyeCategories, miniSets, itemPicture}
