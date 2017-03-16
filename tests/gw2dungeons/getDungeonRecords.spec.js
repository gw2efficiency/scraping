/* eslint-env node, mocha */
import {expect} from 'chai'
import fetchMock from 'lets-fetch/mock'
import getDungeonRecords from '../../src/gw2dungeons/getDungeonRecords.js'

getDungeonRecords.__set__('fetch', fetchMock)

describe('gw2dungeons > getDungeonRecords', function () {
  this.timeout(20000)
  beforeEach(() => {
    fetchMock.enableMocking(false)
  })

  it('builds the correct options for the API call', async () => {
    fetchMock.enableMocking(true)
    fetchMock.addResponse({foo: 'bar'})
    let json = await getDungeonRecords.__get__('gw2DungeonsApi')({
      foo: 'bar',
      foobar: '1 2'
    })

    expect(json).to.deep.equal({foo: 'bar'})
    expect(fetchMock.lastUrl()).to.equal('http://gw2dungeons.net/records.php')
    expect(fetchMock.lastOption()).to.deep.equal({
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'foo=bar&foobar=1%202'
    })
  })

  it('transforms a record correctly', () => {
    let record = getDungeonRecords.__get__('transformRecord')({
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
    let record = getDungeonRecords.__get__('transformRecord')({
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
    let records = await getDungeonRecords()
    let dungeons = [
      'Spirit Vale',
      'Salvation Pass',
      'Stronghold of the Faithful',
      'Fractals of the Mists',
      'Ascalonian Catacombs',
      'Caudecus\'s Manor',
      'Twilight Arbor',
      'Sorrow\'s Embrace',
      'Citadel of Flame',
      'Honor of the Waves',
      'Crucible of Eternity',
      'The Ruined City of Arah'
    ]

    expect(Object.keys(records)).to.deep.equal(dungeons)
    expect(Object.keys(records['Twilight Arbor'])).to.contain('Story')

    let story = records['Citadel of Flame']['Story']
    expect(typeof story.seconds).to.equal('number')
    expect(story.seconds).to.be.below(500)
    expect(story.seconds).to.be.above(20)
    expect(story.url).to.contain('http')
    expect(Object.keys(story.guild)).to.deep.equal(['name', 'tag'])
  })
})
