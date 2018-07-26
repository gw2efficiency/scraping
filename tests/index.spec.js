/* eslint-env node, mocha */
import {expect} from 'chai'
import module from '../src/index.js'

describe('module', () => {
  it('adds all available methods into one module', () => {
    expect(Object.keys(module)).to.deep.equal([
      'claimTicketOffers',
      'dyeCategories',
      'miniSets',
      'itemPicture',
      'gemPriceHistory',
      'craftingProfessionCost'
    ])
  })
})
