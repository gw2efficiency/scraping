/* eslint-env node, mocha */
const expect = require('chai').expect
const rewire = require('rewire')
const reqMock = require('requester/mock')
const gw2dungeons = rewire('../../src/pages/gw2dungeons.js')

gw2dungeons.__set__('requester', reqMock)

describe('gw2dungeons', function () {
  this.timeout(10000)
  beforeEach(() => {
    reqMock.enableMocking(false)
  })

  it('builds the correct options for the API call', async () => {
    reqMock.enableMocking(true)
    reqMock.addResponse({foo: 'bar'})
    let json = await gw2dungeons.__get__('gw2DungeonsApi')({foo: 'bar', foobar: '1 2'})

    expect(json).to.deep.equal({foo: 'bar'})
    expect(reqMock.lastUrl()).to.equal('http://gw2dungeons.net/records.php')
    expect(reqMock.lastOption()).to.deep.equal({
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'foo=bar&foobar=1%202'
    })
  })

  it('transforms a record correctly', () => {
    let record = gw2dungeons.__get__('transformRecord')({
      time: '123000',
      topiclink: 'http://test.de',
      groups: [{name: 'Guild', tag: '[TAG]'}]
    })

    expect(record).to.deep.equal({
      seconds: 123,
      url: 'http://test.de',
      guild: {name: 'Guild', tag: '[TAG]'}
    })
  })

  it('transforms a record correctly if the topiclink is invalid', () => {
    let record = gw2dungeons.__get__('transformRecord')({
      time: '456000',
      topiclink: 'test',
      groups: [{name: 'Guild', tag: '[TAG]'}]
    })

    expect(record).to.deep.equal({
      seconds: 456,
      url: null,
      guild: {name: 'Guild', tag: '[TAG]'}
    })
  })

  it('gets the correct records {LIVE}', async () => {
    let records = await gw2dungeons.getDungeonRecords()
    let dungeons = [
      'Ascalonian Catacombs',
      "Caudecus's Manor",
      'Twilight Arbor',
      "Sorrow's Embrace",
      'Citadel of Flame',
      'Honor of the Waves',
      'Crucible of Eternity',
      'The Ruined City of Arah',
      'Fractals of the Mists'
    ]

    expect(Object.keys(records)).to.deep.equal(dungeons)
    expect(Object.keys(records['Twilight Arbor'])).to.contain('Story')

    let story = records['Citadel of Flame']['Story']
    expect(story.seconds).to.be.a.number
    expect(story.seconds).to.be.below(500)
    expect(story.seconds).to.be.above(20)
    expect(story.url).to.contain('http')
    expect(Object.keys(story.guild)).to.deep.equal(['name', 'tag'])
  })
})
