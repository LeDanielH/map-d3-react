const mapOptions = {
	width: 980,
	height: 551,
	panIncrement: 10,
	rangeIncrement: 2,
	gmLogo: 'https://www.google.com/maps/about/images/home/home-maps-icon.svg?mmfb=de7ec406c933d20ac2caf9114c2434a9',
	centerWorld: {
		long: 0,
		lat: 25
	},

	zooms: [
		{
			zoom: 1,
			boundaries: {
				longMax: 5,
				longMin: -5,
				latMax: 30,
				latMin: -30
			}
		},
		{
			zoom: 2,
			boundaries: {
				longMax: 92,
				longMin: -92,
				latMax: 65,
				latMin: -65
			},
		},
		{
			zoom: 4,
			boundaries: {
				longMax: 135,
				longMin: -135,
				latMax: 80,
				latMin: -80
			},
		},
		{
			zoom: 8,
			boundaries: {
				longMax: 158,
				longMin: -158,
				latMax: 85,
				latMin: -85
			},
		},
		{
			zoom: 16,
			boundaries: {
				longMax: 169,
				longMin: -169,
				latMax: 88,
				latMin: -88
			},
		}
	],

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
	// https://stackoverflow.com/questions/11849636/maximum-lat-and-long-bounds-for-the-world-google-maps-api-latlngbounds
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
		scale: 160,
		xOffset: 0,
		yOffset: 0,
		rotation: [0,0,0],
		precision: 0.1
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