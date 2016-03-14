const requester = require('gw2e-requester')

// Get the gem price history
async function gemPriceHistory () {
  let gemChart = await requester.single('http://gw2spidy.com/gem_chart')
  return {
    goldToGems: gemChart[0].data,
    gemsToGold: gemChart[2].data
  }
}

module.exports = {gemPriceHistory}
