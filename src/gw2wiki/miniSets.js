import cheerio from 'cheerio'
import { getWikiHtml } from './helpers.js'

// Get the miniature sets
export default async function miniSets () {
  let miniSetsPagesNames = ['Mini_Collection—Set_I', 'Mini_Collection—Set_II',
    'Mini_Collection—Set_III', 'Miniature']
  let map = {}

  // Create the category string
  function composeTitleAsPath (mainCategory, subcategory) {
    if (!subcategory) {
      return mainCategory
    } else {
      return mainCategory + ' / ' + subcategory
    }
  }

  // Parse a simple table (heading -> all minis)
  function simpleTable (table, setTitle) {
    let setMiniatures = $(table).find('a')

    setMiniatures.each((i, mini) => {
      map[$(mini).attr('title')] = setTitle
    })
  }

  // Parse a extended table
  function extendedTable (table, category) {
    let tableRows = $(table).find('tr')
    let lastTitle
    tableRows.each((i, row) => {
      if (i === 0) {
        return
      }

      // If there's a th in the row, it must be a category header, so we save that for title
      if ($(row).find('th').length === 1) {
        lastTitle = $(row).find('th').text().trim()
        return
      }

      // Replace breaks with spaces so we can have nice headings
      $(row).find('br').replaceWith($('<span> </span>'))

      // Get the mini off the row
      let setMiniature = $(row).find('td').first().find('a').attr('title')

      map[setMiniature] = composeTitleAsPath(category, lastTitle)
    })
  }

  let $
  for (let i = 0; i < miniSetsPagesNames.length; i++) {
    let page = await getWikiHtml(miniSetsPagesNames[i])
    $ = cheerio.load(page, { ignoreWhitespace: false })

    if (i < 3) {
      let tables = $('.item.table')
      tables.each((_, table) => {
        simpleTable(table, 'Set ' + (i + 1).toString())
      })
    } else {
      // Parse all headings and the tables after them
      let headings = $('h4 .mw-headline')
      headings.each((i, heading) => {
        let setTitle = $(heading).text()
        let table = $(heading).parent().nextUntil('h4', 'table')

        // If the table has more than 4 headings, the headings
        // are in the rows, and we need to parse an extended table
        if (table.find('th').length === 4) {
          simpleTable(table, setTitle)
        } else {
          extendedTable(table, setTitle)
        }
      })
    }
  }

  return map
}
