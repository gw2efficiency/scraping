/* eslint-env node, mocha */
import { expect } from 'chai'
import fetchMock from 'lets-fetch/mock'
import { generateWikiMarkup, generateWikiImage } from './_mock.js'
import itemPicture from '../../src/gw2wiki/itemPicture.js'

itemPicture.__set__('fetch', fetchMock)

describe('gw2wiki > itemPictures', function () {
  this.timeout(20000)
  beforeEach(() => {
    fetchMock.enableMocking(false)
    fetchMock.reset()
  })

  it('gets the correct item image {LIVE}', async () => {
    let picture = await itemPicture('The Bifrost')
    expect(picture).to.contain('https://wiki.guildwars2.com/images/')
  })

  it('gets the correct item image if the gallery entry is missing', async () => {
    fetchMock.enableMocking(true)
    fetchMock.addResponse(generateWikiMarkup('...'))
    fetchMock.addResponse(generateWikiImage('http://image.com/img/kudzu.jpg'))

    let picture = await itemPicture('Kudzu')
    expect(picture).to.equal('http://image.com/img/kudzu.jpg')
    expect(fetchMock.urls().length).to.equal(2)
  })

  it('fails gracefully if there is no image for an item', async () => {
    fetchMock.enableMocking(true)
    fetchMock.addResponse(generateWikiMarkup('...'))
    fetchMock.addResponse(generateWikiImage())

    let picture = await itemPicture('Unknown Item')
    expect(picture).to.equal(null)
    expect(fetchMock.urls().length).to.equal(2)
  })
})
