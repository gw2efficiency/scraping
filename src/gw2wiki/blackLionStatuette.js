import { getWikiHtml } from './helpers.js'
import execAll from 'execall'

// Get the current claim ticket offers
export default async function blackLionStatuette () {
  let page = await getWikiHtml('Black_Lion_Statuette')

  // Find all items sold for Black Lion Statuette with their costs
  let regex = /<tr[\s\S]*?<a href="[^"]*" title="([^"]*)">[\s\S]*?<div class="inline-icon">(\d*)(&nbsp;|&#160;)*<a [^>]* title="Black Lion Statuette"[\s\S]*?<\/tr>/gi
  let matches = execAll(regex, page).map(x => x.sub)

  let map = {}
  matches.map(x => {
    const name = x[0].replace(/&#39;/g, `'`)
    map[name] = parseInt(x[1], 10)
  })

  return map
}
