# saucer-api

A basic API for getting Flying Saucer store locations, beers, and beer details.

Scraped data is cached for 24 hours.

## Routes

`/nearby`

Params: `latitude`, `longitude`

Returns the closest store location.

`/stores`

Returns a list of store locations.

`/stores/:id/beers`

Returns all current beers for a store.

`/beers/:id`

Returns details for a single beer.
