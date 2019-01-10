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
    let offers = await blackLionStatuette()
    let offerKeys = Object.keys(offers)

    expect(offerKeys.length).to.be.above(10)
    expect(typeof offerKeys[0]).to.equal('string')
    expect(typeof offers[offerKeys[0]]).to.equal('number')
    expect(offers[offerKeys[0]]).to.be.above(0)
  })
})
