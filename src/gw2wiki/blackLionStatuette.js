import { getSmwQueryResult } from './helpers.js'

// Get the current claim ticket offers
export default async function blackLionStatuette () {
  const result = await getSmwQueryResult('[[Has vendor::Black Lion Statuette]][[Has item cost.Has item currency::Black Lion Statuette]]|?Sells item=item|?Has item cost.Has item value=value')

  const map = Object.values(result.query.results).map(data => {
    return [data.printouts['item'][0].fulltext, parseInt(data.printouts['value'][0])]
  })

  return Object.fromEntries(map)
}
