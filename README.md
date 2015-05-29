# saucer-api

A basic API for getting Flying Saucer store locations, beers, and beer details.

Scraped data is cached for 24 hours.

## Routes

`/nearby`

Params: `latitude`, `longitude`

Returns the closest store location.

`/stores`

Returns a list of store locations.

`/stores/:slug/beers`

Returns all current beers for a store.

`/beers/:id`

Returns details for a single beer.

## Projects using this API

* [What should I fucking drink tonight?](http://whatshouldifuckingdrinktonight.com/)
* [Saucer iOS app (unpublished)](https://github.com/nicinabox/Saucer)

## Contributing

Something missing? Think you could do it better? Contributions welcome!

* Do something cool on a feature branch
* Probably test it or something
* Take care to follow the existing style
* Send a pull request

## TODO

* [ ] Firesale beers, but unfortunately I don't think this data is published anywhere
* [ ] UFO club auth
* [ ] UFO club tasted beers
* [ ] New beers this week
