/* eslint-env node, mocha */
import {expect} from 'chai'
import fetchMock from 'lets-fetch/mock'
import {generateWikiMarkup, generateWikiImage} from './_mock.js'
import helpers from '../../src/gw2wiki/helpers.js'

helpers.__set__('fetch', fetchMock)

describe('gw2wiki > helpers', function () {
  this.timeout(20000)
  beforeEach(() => {
    fetchMock.enableMocking(true)
    fetchMock.reset()
  })

  it('gets the correct wiki markup', async () => {
    let text = '[[Controls]] are functions used by the player to open menus'
    fetchMock.addResponse(generateWikiMarkup(text))

    let markup = await helpers.getWikiMarkup('Controls')

    expect(fetchMock.lastUrl()).to.equal('http://wiki.guildwars2.com/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Controls')
    expect(markup).to.equal(text)
  })

  it('gets the correct wiki html', async () => {
    let text = '<h1>Controls</h1> are functions used by the player to open menus'
    fetchMock.addResponse(text)

    let html = await helpers.getWikiHtml('Controls')

    expect(fetchMock.lastUrl()).to.equal('http://wiki.guildwars2.com/wiki/Controls')
    expect(html).to.equal(text)
  })

  it('gets the correct wiki image', async () => {
    let image = 'http://image.url/image.jpg'
    fetchMock.addResponse(generateWikiImage(image))

    let picture = await helpers.getWikiImage('Incinerator.jpg')

    expect(fetchMock.lastUrl()).to.equal('http://wiki.guildwars2.com/api.php?action=query&prop=imageinfo&iiprop=timestamp%7Cuser%7Curl&format=json&titles=File%3AIncinerator.jpg')
    expect(picture).to.equal(image)
  })
})
