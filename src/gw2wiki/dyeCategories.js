import cheerio from 'cheerio'
import {getWikiHtml} from './helpers.js'

// Get the dye categories
export default async function dyeCategories () {
  let page = await getWikiHtml('Dye')
  let $ = cheerio.load(page)

  // Get the dye table after the given ID
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

  let materials = mapDyeTable('By_Material')
  let sets = {...mapDyeTable('By_Set'), ...mapDyeTable('Exclusive_colors')}
  let colors = mapDyeTable('By_Color')
  return {materials, sets, colors}
}
