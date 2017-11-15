const mapOptions = {
	width: 980,
	height: 551,
	zoomMin: 1,
	zoomMax: 8,
	zoomFocus: 4,
	centerWorld: [0, 25],
	waterColor: '#0d5469',

	countryStyle: {
		default: {
			fill: "#ECEFF1",
			stroke: "#607D8B",
			strokeWidth: 0.75,
			outline: "none",
		},
		hover: {
			fill: "#607D8B",
			stroke: "#607D8B",
			strokeWidth: 0.75,
			outline: "none",
		},
		pressed: {
			fill: "#FF5722",
			stroke: "#607D8B",
			strokeWidth: 0.75,
			outline: "none",
		},
	},
	wrapperStyles: {
		width: "100%",
		maxWidth: 980,
		margin: "0 auto",
	},

	projections:{
		times: "times",
		robinson: "robinson",
		eckert4: "eckert4",
		winkel3: "winkel3",
		miller: "miller",
		mercator: "mercator"
	},
	projectionConfig: {
		scale: 200,
		rotation: [-10,0,0],
	},
	annotationStyles: {
		pointerEvents: 'none'
	},
	africa: [
		"MAR","DZA", "ZAF", "MUS", "TUN", "CPV", "ETH", "SYC", "NGA", "MDG",
		"COD", "LBY", "GMB", "KEN", "GHA", "TZA", "MLI", "SDN", "SOM", "CIV",
		"ZWE", "SEN", "CMR", "ERI", "UGA", "NAM", "REU", "MOZ", "AGO", "GAB",
		"BFA", "RWA", "GIN", "TCD", "SSD", "MRT", "BWA", "NER", "DJI", "ZMB",
		"SLE", "MWI", "LBR", "TGO", "BEN", "BDI", "SWZ", "COG", "LSO", "GNQ",
		"STP", "EGY", "SOM", "CAF", "SOL", "ESH", "GNB"
	],
	continents: [
		'Africa',
		'North America',
		'Europe',
		'South America',
		'Seven seas (open ocean)',
		'Asia',
		'Oceania',
		'Antarctica'
	]
};

export default mapOptions;