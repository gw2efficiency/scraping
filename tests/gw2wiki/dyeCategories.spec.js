/* eslint-env node, mocha */
import { expect } from 'chai'
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

    expect(keys).to.deep.equal(['materials', 'sets', 'colors', 'birthdays'])

    let materials = categories.materials
    expect(Object.keys(materials)).to.contain('Celestial Dye')
    expect(Object.values(materials)).to.contain('Vibrant dyes')
    expect(materials['Abyss Dye']).to.equal('Natural metallic dyes')

    let sets = categories.sets
    expect(Object.keys(sets)).to.contain('Celestial Dye')
    expect(Object.values(sets)).to.contain('Starter dyes')
    expect(sets['Abyss Dye']).to.equal('Rare dyes')
    expect(sets['Flame Dye']).to.equal('Flame Dye Kit')
    expect(sets['Imperial Red Dye']).to.equal('Crimson Lion Dye Kit')

    let colors = categories.colors
    expect(Object.keys(colors)).to.contain('Celestial Dye')
    expect(Object.values(colors)).to.contain('Blue dyes')
    expect(colors['Abyss Dye']).to.equal('Gray dyes')

    let birthdays = categories.birthdays
    expect(Object.keys(birthdays)).to.contain('Deep Glacial Teal Dye')
    expect(birthdays['Electro Pink Dye']).to.deep.equal([
      'Celebratory Dye Pack',
      'Jubilant Dye Pack'
    ])
    expect(birthdays['Enameled Strawberry Dye']).to.deep.equal(['Dedicated Dye Kit'])
  })
})
