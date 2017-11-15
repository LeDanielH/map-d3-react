+ to convert multiple geo.json files to one, use following steps
1. open you CLI
2. `npm install -g @mapbox/geojson-merge`
3. go to directory, where your `*.geo.json` files are
4. write this in the CLI `geojson-merge *.geo.json > mergedName.geo.json --stream
5. todo memory leak error investigation, steps mentioned before are useless as some countries are skipped in conversion