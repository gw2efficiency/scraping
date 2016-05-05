# gw2api-scraping

[![Build Status](https://img.shields.io/travis/gw2efficiency/gw2api-scraping.svg?style=flat-square)](https://travis-ci.org/gw2efficiency/gw2api-scraping)
[![Coverage Status](https://img.shields.io/codecov/c/github/gw2efficiency/gw2api-scraping/master.svg?style=flat-square)](https://codecov.io/github/gw2efficiency/gw2api-scraping)

> Scraping unofficial sites for information the API can't provide.

*This is part of [gw2efficiency](https://gw2efficiency.com). Please report all issues in [the central repository](https://github.com/gw2efficiency/issues/issues).*

## Install

```
npm install gw2e-gw2api-scraping
```

This module can be used for Node.js. Theoretically it works in browsers using [Browserify](https://github.com/substack/browserify-handbook#how-node_modules-works), but due to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) most methods are not available.

**Requires the [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) to work.**

## Usage

```js
const scraping = require('gw2e-gw2api-scraping')

// Get the current offers for claim tickets from wiki.guildwars2.com
let offers = await scraping.claimTicketOffers()

// Get the dye categories (materials, sets, colors) from wiki.guildwars2.com
let categories = await scraping.dyeCategories()

// Get the minipet set names from wiki.guildwars2.com
let sets = await scraping.miniSets()

// Get the picture for an item from wiki.guildwars2.com
let itemPicture = await scraping.itemPicture('Incinerator')

// Get the current dungeon records from gw2-dungeons.net
let records = await scraping.getDungeonRecords()

// Get the current achievement leaderboard from guildwars2.com
// Note: this takes ~40 seconds because of heavy rate limiting
let leaderboard = await scraping.achievementLeaderboard()

// Get the gem price history from gw2spidy.com
let prices = await scraping.gemPriceHistory()
```

## Tests

```
npm test
```

The tests of this module get executed against the live sites instead of mock objects,
because the structure of the scraped pages could change at any time without notice.

## Licence

MIT
