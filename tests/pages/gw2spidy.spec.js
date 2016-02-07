/* eslint-env node, mocha */
const expect = require('chai').expect
const gw2spidy = require('../../src/pages/gw2spidy.js')

describe('gw2spidy', function () {
  this.timeout(4000)

  it('gets the gem price history {LIVE}', async () => {
    let prices = await gw2spidy.gemPriceHistory()
    expect(Object.keys(prices)).to.deep.equal(['goldToGems', 'gemsToGold'])
    expect(prices.goldToGems.length).to.be.above(5000)
    expect(prices.gemsToGold.length).to.be.above(5000)
    expect(prices.gemsToGold[0].length).to.equal(2)
  })
})
