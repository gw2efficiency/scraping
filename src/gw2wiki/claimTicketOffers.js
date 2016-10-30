import {getWikiHtml} from './helpers.js'
import {matchAll} from '../helpers.js'

// Get the current claim ticket offers
export default async function claimTicketOffers () {
  let page = await getWikiHtml('Black Lion Weapons Specialist (The Vaults)')

  // Find all items sold for black lion tickets with their costs
  let regex = /<tr[\s\S]*?<a href="[^"]*" title="([^"]*)">[\s\S]*?<div class="inline-icon">(\d*)(&nbsp;|&#160;)*<a [^>]* title="Black Lion Claim Ticket"[\s\S]*?<\/tr>/gi
  let matches = matchAll(regex, page)

  let map = {}
  matches.map(x => {
    map[x[1]] = parseInt(x[2], 10)
  })

  // Remove failures
  delete map['Black Lion Claim Ticket']

  return map
}
