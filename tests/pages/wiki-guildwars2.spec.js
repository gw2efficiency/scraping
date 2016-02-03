const expect = require('chai').expect
const rewire = require('rewire')
const reqMock = require('requester/mock')
const wiki = rewire('../../src/pages/wiki-guildwars2.js')

wiki.__set__("requester", reqMock)

describe('wiki-guildwars2', function () {
  this.timeout(10000)
  beforeEach(() => {
    reqMock.enableMocking(false)
    reqMock.reset()
  })

  function generateWikiMarkup (content) {
    return {query: {pages: {123: {title: "Controls", revisions: [{"*": content}]}}}}
  }

  function generateWikiImage (url) {
    if (!url) {
      return {query: {pages: {123: {title: "File:Kudzu.jpg"}}}}
    }

    return {query: {pages: {123: {title: "File:Kudzu.jpg", imageinfo: [{url: url}]}}}}
  }

  it('gets the correct wiki markup', async () => {
    reqMock.enableMocking(true)
    let text = '[[Controls]] are functions used by the player to open menus'
    reqMock.addResponse(generateWikiMarkup(text))

    let markup = await wiki.__get__('getWikiMarkup')('Controls')

    expect(reqMock.lastUrl()).to.equal('http://wiki.guildwars2.com/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Controls')
    expect(markup).to.equal(text)
  })

  it('gets the correct wiki html', async () => {
    reqMock.enableMocking(true)
    let text = '<h1>Controls</h1> are functions used by the player to open menus'
    reqMock.addResponse(text)

    let html = await wiki.__get__('getWikiHtml')('Controls')

    expect(reqMock.lastUrl()).to.equal('http://wiki.guildwars2.com/wiki/Controls')
    expect(html).to.equal(text)
  })

  it('gets the correct wiki image', async () => {
    reqMock.enableMocking(true)
    let image = 'http://image.url/image.jpg'
    reqMock.addResponse(generateWikiImage(image))

    let picture = await wiki.__get__('getWikiImage')('Incinerator.jpg')

    expect(reqMock.lastUrl()).to.equal('http://wiki.guildwars2.com/api.php?action=query&prop=imageinfo&iiprop=timestamp%7Cuser%7Curl&format=json&titles=File%3AIncinerator.jpg')
    expect(picture).to.equal(image)
  })

  it('gets the correct claim ticket offers {LIVE}', async () => {
    let offers = await wiki.claimTicketOffers()
    let offerKeys = Object.keys(offers)

    expect(offerKeys.length).to.be.above(10)
    expect(offerKeys[0]).to.be.a.string
    expect(offers[offerKeys[0]]).to.be.a.number
    expect(offers[offerKeys[0]]).to.be.above(0)
  })

  it('gets the correct item image {LIVE}', async () => {
    let picture = await wiki.itemPicture('The Bifrost')

    expect(picture).to.be.a.string
    expect(picture).to.contain('http://wiki.guildwars2.com/images/')
  })

  it('gets the correct item image if the gallery entry is missing', async () => {
    reqMock.enableMocking(true)
    reqMock.addResponse(generateWikiMarkup('...'))
    reqMock.addResponse(generateWikiImage('http://image.com/img/kudzu.jpg'))

    let picture = await wiki.itemPicture('Kudzu')
    expect(picture).to.equal('http://image.com/img/kudzu.jpg')
    expect(reqMock.urls().length).to.equal(2)
  })

  it('fails gracefully if there is no image for an item', async () => {
    reqMock.enableMocking(true)
    reqMock.addResponse(generateWikiMarkup('...'))
    reqMock.addResponse(generateWikiImage())

    let picture = await wiki.itemPicture('Unknown Item')
    expect(picture).to.equal(null)
    expect(reqMock.urls().length).to.equal(2)
  })

  it('gets the correct dye categories {LIVE}', async () => {
    let categories = await wiki.dyeCategories()
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

  it('gets the correct mini sets {LIVE}', async () => {
    let sets = await wiki.miniSets()

    expect(Object.keys(sets)).to.contain('Miniature Orange Tabby Cat')
    expect(Object.values(sets)).to.contain('Flame and Frost')
    expect(sets['Mini Ember']).to.equal('Set 3')
  })
})
