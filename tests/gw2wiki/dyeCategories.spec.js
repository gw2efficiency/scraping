/* eslint-env node, mocha */
import {expect} from 'chai'
import fetchMock from 'lets-fetch/mock'
import dyeCategories from '../../src/gw2wiki/dyeCategories.js'

dyeCategories.__set__('fetch', fetchMock)

describe('gw2wiki > dyeCategories', function () {
  this.timeout(20000)
  beforeEach(() => {
    fetchMock.enableMocking(false)
    fetchMock.reset()
  })

  it('gets the correct dye categories {LIVE}', async () => {
    let categories = await dyeCategories()
    let keys = Object.keys(categories)

    expect(keys).to.deep.equal(['materials', 'sets', 'colors'])

    let materials = categories.materials
    expect(Object.keys(materials)).to.contain('Celestial Dye')
    expect(Object.values(materials)).to.contain('Vibrant dyes')
    expect(materials['Abyss Dye']).to.equal('Natural metallic dyes')

    let sets = categories.sets
    expect(Object.keys(sets)).to.contain('Celestial Dye')
    expect(Object.values(sets)).to.contain('Starter dyes')
    expect(sets['Abyss Dye']).to.equal('Rare dyes')

    let colors = categories.colors
    expect(Object.keys(colors)).to.contain('Celestial Dye')
    expect(Object.values(colors)).to.contain('Blue dyes')
    expect(colors['Abyss Dye']).to.equal('Gray dyes')
  })
})
