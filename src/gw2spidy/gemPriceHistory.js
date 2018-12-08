import fetch from 'lets-fetch'

// Get the gem price history
export default async function gemPriceHistory () {
  let gemChart = await fetch.single('http://gw2spidy.com/gem_chart')
  return { goldToGems: gemChart[0].data, gemsToGold: gemChart[2].data }
}
