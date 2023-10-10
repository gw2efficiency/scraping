/* eslint-env node, mocha */
import { expect } from 'chai'
import fetchMock from 'lets-fetch/mock'
import blackLionStatuette from '../../src/gw2wiki/blackLionStatuette.js'

blackLionStatuette.__set__('fetch', fetchMock)

describe('gw2wiki > blackLionStatuette', function () {
  this.timeout(20000)
  beforeEach(() => {
    fetchMock.enableMocking(false)
    fetchMock.reset()
  })

  it('gets the correct claim ticket offers {LIVE}', async () => {
    const offers = await blackLionStatuette()
    const offerEntries = Object.entries(offers)

    expect(offerEntries.length).to.be.above(10)

    Object.entries(offers).forEach(([item, cost]) => {
      expect(typeof item).to.equal('string')
      expect(typeof cost).to.equal('number')
      expect(cost).to.be.not.NaN
      expect(cost).to.be.above(0)
    })
  })
})
