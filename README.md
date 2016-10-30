# scraping

[![Build Status](https://img.shields.io/travis/gw2efficiency/scraping.svg?style=flat-square)](https://travis-ci.org/gw2efficiency/scraping)
[![Coverage Status](https://img.shields.io/codecov/c/github/gw2efficiency/scraping/master.svg?style=flat-square)](https://codecov.io/github/gw2efficiency/scraping)

> Scraping unofficial sites for game information.

*This is part of [gw2efficiency](https://gw2efficiency.com). Please report all issues in [the central repository](https://github.com/gw2efficiency/issues/issues).*

## Install

```
npm install gw2e-scraping
```

This module can be used for Node.js. Theoretically it is usable in browsers using [Browserify](https://github.com/substack/browserify-handbook#how-node_modules-works), but due to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) most methods won't work.

**Requires the [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) to work.**

## Usage

```js
import * as scraping from 'gw2e-scraping'

// Get the current offers for claim tickets from wiki.guildwars2.com
scraping.claimTicketOffers().then(...)

// Get the dye categories (materials, sets, colors) from wiki.guildwars2.com
scraping.dyeCategories().then(...)

// Get the minipet set names from wiki.guildwars2.com
scraping.miniSets().then(...)

// Get the picture for an item from wiki.guildwars2.com
scraping.itemPicture('Incinerator').then(...)

// Get the current dungeon records from gw2-dungeons.net
scraping.getDungeonRecords().then(...)

// Get the current achievement leaderboard from guildwars2.com
// Note: this takes ~40 seconds because of heavy rate limiting
scraping.achievementLeaderboard().then(...)

// Get the gem price history from gw2spidy.com
scraping.gemPriceHistory().then(...)

// Get the cost to level professions from gw2crafts.net
scraping.craftingProfessionCost().then(...)
```

## Tests

```
npm test
```

> **Note:** Some tests of this module get executed against the live sites instead of mock objects, because the structure of the scraped pages could change at any time without notice.

## Licence

MIT
