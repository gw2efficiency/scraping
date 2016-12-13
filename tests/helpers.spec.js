/* eslint-env node, mocha */
import {expect} from 'chai'
import * as helpers from '../src/helpers.js'

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
})
