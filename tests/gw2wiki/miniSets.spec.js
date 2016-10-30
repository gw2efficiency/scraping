/* eslint-env node, mocha */
import {expect} from 'chai'
import fetchMock from 'lets-fetch/mock'
import miniSets from '../../src/gw2wiki/miniSets.js'

miniSets.__set__('fetch', fetchMock)

describe('gw2wiki > miniSets', function () {
  this.timeout(20000)
  beforeEach(() => {
    fetchMock.enableMocking(false)
    fetchMock.reset()
  })

  it('gets the correct mini sets {LIVE}', async () => {
    let sets = await miniSets()

    expect(Object.keys(sets)).to.contain('Miniature Orange Tabby Cat')
    expect(Object.values(sets)).to.contain('Flame and Frost')
    expect(sets['Mini Ember']).to.equal('Set 3')
  })
})
