const expect = require('chai').expect
const helpers = require('../src/helpers.js')

describe('helpers', () => {
  describe('buildUrl', () => {
    let buildUrl = helpers.buildUrl

    it('returns the url', () => {
      let url = buildUrl('http://test.io')
      expect(url).to.equal('http://test.io')
    })

    it('ignores the empty query parameters', () => {
      let url = buildUrl('http://test.io', {})
      expect(url).to.equal('http://test.io')
    })

    it('builds a single query parameter', () => {
      let url = buildUrl('http://test.io', {foo: 'bar'})
      expect(url).to.equal('http://test.io?foo=bar')
    })

    it('builds multiple query parameters', () => {
      let url = buildUrl('http://test.io', {a: 'foo', b: 'bar'})
      expect(url).to.equal('http://test.io?a=foo&b=bar')
    })

    it('escapes query parameters', () => {
      let url = buildUrl('http://test.io', {a: 'foo bar'})
      expect(url).to.equal('http://test.io?a=foo%20bar')
    })
  })

  describe('matchAll', () => {
    let matchAll = helpers.matchAll

    it('handles no matches', () => {
      let matches = matchAll(/b/g, 'aaa')
      expect(matches).to.deep.equal([])
    })

    it('prevents endless loops', () => {
      expect(() => matchAll(/b/, 'aaa')).to.throw(Error)
    })

    it('finds all matches', () => {
      let matches = matchAll(/a/g, 'aaa')
      expect(matches).to.deep.equal([['a'], ['a'], ['a']])
    })

    it('finds all submatches', () => {
      let matches = matchAll(/a(b)(c)(d*)(ef)g/g, 'abcdefg abcge abcdddefg')
      expect(matches).to.deep.equal([
        ['abcdefg', 'b', 'c', 'd', 'ef'],
        ['abcdddefg', 'b', 'c', 'ddd', 'ef']
      ])
    })
  })
})
