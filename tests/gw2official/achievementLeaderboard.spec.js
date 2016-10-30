/* eslint-env node, mocha */
import {expect} from 'chai'
import achievementLeaderboard from '../../src/gw2official/achievementLeaderboard.js'

describe('gw2official > achievementLeaderboard', function () {
  this.timeout(200000)

  it('parses a timestring correctly', () => {
    let time = achievementLeaderboard.__get__('parseTimestring')('Since\n            1/20/16 2:01 PM PST')
    expect((new Date(time)).getTime()).to.equal((new Date('Wed Jan 20 2016 23:01:00 GMT+0100 (CET)')).getTime())
  })

  it('orders an leaderboard array correctly', () => {
    let input = [
      {regionRank: 1, points: 5678, name: 'account.5678', region: 'na'},
      {regionRank: 2, points: 123, name: 'account-aaa.1234', region: 'eu'},
      {regionRank: 3, points: 777, name: 'account-ccc.1234', region: 'na'},
      {regionRank: 1, points: 12345, name: 'account.1234', region: 'eu'},
      {regionRank: 2, points: 1234, name: 'account-bbb.1234', region: 'na'},
      {regionRank: 1, points: 12345, name: 'account.1234', region: 'eu'}
    ]

    expect(achievementLeaderboard.__get__('cleanupLeaderboardArray')(input)).to.deep.equal([
      {
        rank: 1,
        regionRank: 1,
        points: 12345,
        name: 'account.1234',
        region: 'eu'
      },
      {
        rank: 2,
        regionRank: 1,
        points: 5678,
        name: 'account.5678',
        region: 'na'
      },
      {
        rank: 3,
        regionRank: 2,
        points: 1234,
        name: 'account-bbb.1234',
        region: 'na'
      },
      {
        rank: 4,
        regionRank: 3,
        points: 777,
        name: 'account-ccc.1234',
        region: 'na'
      },
      {
        rank: 5,
        regionRank: 2,
        points: 123,
        name: 'account-aaa.1234',
        region: 'eu'
      }
    ])
  })

  // The official leaderboard is wonky, which is why this test is pretty defensive
  it('gets the achievement leaderboard {LIVE}', async () => {
    let leaderboard = await achievementLeaderboard()
    expect(leaderboard[1].rank).to.equal(2)
    expect(leaderboard[0].regionRank).to.equal(1)
    expect(leaderboard[10].name).to.exist
    expect(leaderboard[0].points).to.be.above(30000)
    expect(leaderboard[20].world).to.exist
    expect(leaderboard[30].region).to.exist
    expect(leaderboard[30].region).to.be.oneOf(['eu', 'na'])
    expect(leaderboard.length).to.be.above(1500)
  })
})
