# saucer-api

## Routes

`/stores`

Example:

```
curl http://localhost:4567/stores

{
  "addison": "Dallas / Addison, TX",
  "austin": "Austin, TX",
  ...
  "sugarland": "Sugar Land, TX",
  "thelake": "The Lake - Garland, TX"
}
```

`/stores/:id/beers`

Example:

```
curl http://localhost:4567/stores/nashville/beers

{
  "1014": "Lindemans Framboise",
  "10160": "Lexington Brewing Kentucky IPA (BTL)",
  ...
  "986": "Blue Velvet",
  "9997": "New Belgium Snapshot (BTL)"
}
```

`/beers/:id`

```
curl http://localhost:4567/beers/1014

{
  "brewer": "Brouwerij Lindeman's",
  "city": "Vlezenbeek",
  "container": "Draught",
  "country": "Belgium",
  "description": "This Belgian Lambic comes to you from the Senne Valley.  It is produced at Lindemans farm brewery from a Lambic base of barley and wheat. After wild fermentation, the beer is aged in oak barrels.  Fresh raspberries are added creating a secondary fermentation.",
  "style": "Lambic (Fruit Ale)",
  "title": "Lindemans Framboise"
}
```
