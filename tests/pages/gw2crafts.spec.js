/* eslint-env node, mocha */
const expect = require('chai').expect
const rewire = require('rewire')
const gw2crafts = rewire('../../src/pages/gw2crafts.js')

describe('gw2crafts', function () {
  this.timeout(200000)

  it('get the cost of crafting professions {LIVE}', async () => {
    let cost = await gw2crafts.craftingProfessionCost()

    expect(cost).have.all.keys([
      'chef',
      'jeweler',
      'scribe',
      'huntsman',
      'weaponsmith',
      'armorsmith',
      'artificer',
      'tailor',
      'leatherworker'
    ])

    expect(cost['weaponsmith']).have.all.keys([
      '75',
      '150',
      '225',
      '300',
      '400',
      '500'
    ])

    expect(cost['jeweler'][400]).to.be.above(30000)
    expect(cost['chef'][400]).to.be.above(2500)
    expect(cost['weaponsmith'][500]).to.be.above(500000)
  })
})
