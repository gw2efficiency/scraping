/* eslint-env node, mocha */
import {expect} from 'chai'
import gemPriceHistory from '../../src/gw2spidy/gemPriceHistory.js'

describe('gw2spidy > gemPriceHistory', function () {
  this.timeout(4000)

  it('gets the gem price history {LIVE}', async () => {
    let prices = await gemPriceHistory()
    expect(Object.keys(prices)).to.deep.equal(['goldToGems', 'gemsToGold'])
    expect(prices.goldToGems.length).to.be.above(5000)
    expect(prices.gemsToGold.length).to.be.above(5000)
    expect(prices.gemsToGold[0].length).to.equal(2)
  })
})
