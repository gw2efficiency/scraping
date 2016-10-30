import cheerio from 'cheerio'
import {getWikiHtml} from './helpers.js'

// Get the miniature sets
export default async function miniSets () {
  let page = await getWikiHtml('Miniature')
  let $ = cheerio.load(page, {ignoreWhitespace: false})
  let map = {}

  // Parse a simple table (heading -> all minis)
  function simpleTable (table, setTitle) {
    let setMiniatures = $(table).find('a')

    setMiniatures.each((i, mini) => {
      map[$(mini).attr('title')] = setTitle
    })
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
