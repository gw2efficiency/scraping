import { getSmwQueryResult } from './helpers.js'

// Get the current claim ticket offers
export default async function blackLionStatuette () {
  const result = await getSmwQueryResult('[[Has vendor::Black Lion Statuette]][[Has item cost.Has item currency::Black Lion Statuette]]|?Sells item=item|?Has item cost=value')

  const map = {}

  Object.values(result.query.results).forEach(data => {
    const key = data.printouts['item'][0].fulltext
    const value = parseInt(data.printouts['value'][0]['Has item value'].item[0])

    map[key] = value
  })

  return map
}
