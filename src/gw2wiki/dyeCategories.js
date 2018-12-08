import cheerio from 'cheerio'
import { getWikiHtml } from './helpers.js'

// Get the dye categories
export default async function dyeCategories () {
  let page = await getWikiHtml('Dye')
  let $ = cheerio.load(page)

  // Get the dyes in the "Exclusive Colors" table (by dye kit)
  function mapExclusiveColors () {
    const table = $('#Exclusive_colors').parent().nextUntil('table').next().find('tr')
    let kitMap = {}
    let birthdayMap = {}

    table.each((i, row) => {
      if (i < 2) return

      const columns = $(row).children('td')

      // The second column is the name of the dye kit
      const kit = $(columns[1]).find('a').attr('title')

      // The first column is the title of dyes
      const dyes = $(columns[0]).find('a')
        .map((i, link) => $(link).attr('title')).get()
        .filter((x, i, self) => self.indexOf(x) === i)

      // The third column is the title of the birthday packs
      const birthdays = $(columns[2]).find('a')
        .map((i, link) => $(link).attr('title')).get()
        .filter((x, i, self) => self.indexOf(x) === i)

      dyes.forEach(dye => {
        kitMap[dye] = kit
        birthdayMap[dye] = birthdays
      })
    })

    return { kitMap, birthdayMap }
  }

  // Get the dye table after the given header ID
  function mapDyeTable (id) {
    let map = {}
    let sets = $('#' + id).parent().nextUntil('h3', 'table').find('table')

    sets.each((i, set) => {
      let setTitle = $(set).find('a').first().text()
      let setColors = $(set).find('img')

      setColors.each((i, color) => {
        map[$(color).attr('alt')] = setTitle
      })
    })

    return map
  }

  const { kitMap, birthdayMap } = mapExclusiveColors()
  let materials = mapDyeTable('By_Material')
  let sets = { ...mapDyeTable('By_Set'), ...kitMap }
  let colors = mapDyeTable('By_Color')
  return { materials, sets, colors, birthdays: birthdayMap }
}
