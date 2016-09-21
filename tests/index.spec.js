/* eslint-env node, mocha */
const expect = require('chai').expect
const index = require('../src/index.js')

describe('module', () => {
  it('adds all available methods into one module', () => {
    expect(Object.keys(index)).to.deep.equal([
      'claimTicketOffers',
      'dyeCategories',
      'miniSets',
      'itemPicture',
      'getDungeonRecords',
      'achievementLeaderboard',
      'gemPriceHistory',
      'craftingProfessionCost'
    ])
  })
})
