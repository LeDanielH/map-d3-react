import React, { Component } from "react"
import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography,
	Markers,
	Marker,
	Graticule,
	Annotations,
	Annotation
} from "react-simple-maps";

/* to add more custom projections directly from d3-geo-projections */
// import { geoAiry, geoOrthographicRaw } from 'd3-geo-projection';
import { feature } from 'topojson-client';
import worldMap from 'react-simple-maps/topojson-maps/world-50m.json';
import countries from '../../data/countries/dist/countries.json';
import countryCapitals from '../../data/map/country-capitals.json';
import mapOptions from '../options/mapOptions';

// todo might be helpful importing separate topojson files
// const context = require.context('../../data/countries/data', true, /\.topo\.json$/);
// var obj = {};
// context.keys().forEach(function (key) {
// 	obj[key] = context(key);
// });

class Map extends Component {

	constructor() {
		super();
		this.state = {
			center: [0, 0],
			zoom: 1,
			geographyPaths: [],
			locations: [],
			annotations: [],
			projectionType: mapOptions.projections.miller,

			/* to add other custom projections directly from d3-geo-projections */
			// projectionType: geoOrthographicRaw,

			activeAnnotation: null
		};
		this.handleMarkerClick = this.handleMarkerClick.bind(this);
		this.handleCountryClick = this.handleCountryClick.bind(this);
		this.handleReset = this.handleReset.bind(this);
		this.projection = this.projection.bind(this);
		this.handleZoomIn = this.handleZoomIn.bind(this);
		this.handleZoomOut = this.handleZoomOut.bind(this);
		this.handleCountryMouseEnter = this.handleCountryMouseEnter.bind(this);
		this.handleCountryMouseLeave = this.handleCountryMouseLeave.bind(this);
	}

	componentWillMount() {
		this.loadPaths();
		this.loadLocations();
		this.loadAnnotations();
		this.geoFindMe();
	}

	handleCountryMouseEnter(id) {
		this.setState({ activeAnnotation: id })
	}

	handleCountryMouseLeave(id) {
		console.log('hiding annotation', id);
	}

	geoFindMe() {
		const _this = this;

		if (!navigator.geolocation){
			console.log('geolocation is not supported by your browser');
			return;
		}

		function success(position) {
			_this.setState({
				center: [position.coords.longitude, position.coords.latitude],
				zoom: mapOptions.zoomFocus
			});
		}

		function error() {
			console.log('unable to retrieve your location');
		}

		navigator.geolocation.getCurrentPosition(success, error);
	}

	projection(width, height, config) {
		return this.state.projectionType
			// .rotate([-10,-52,0])
			// .scale(config.scale)
	}

	loadPaths() {
		const countries = feature(worldMap, worldMap.objects[Object.keys(worldMap.objects)[0]]).features;
		this.setState({ geographyPaths: countries });
	}

	loadLocations() {
		const cities = countryCapitals.map((city, i) => ({
				id: `city-${i}`,
				name: city.CapitalName,
				coordinates: [city.CapitalLongitude, city.CapitalLatitude]
			})
		);
		this.setState({locations: cities});
	}

	loadAnnotations() {
		const annotations = countries.map((country, i) => ({
				id: `annotation-${i}`,
				name: country.name.common,
				centroid: [country.latlng[1], country.latlng[0]],
				short: country.cca3
			})
		);
		this.setState({ annotations: annotations });
	}

	handleMarkerClick(location) {
		// zoom and pan to a selection
		if(this.state.zoom >= mapOptions.zoomFocus) {
			this.setState({
				center: location.coordinates
			})
		} else {
			this.setState({
				zoom: mapOptions.zoomFocus,
				center: location.coordinates
			})
		}
	}

	handleCountryClick(id) {
		this.setState({ activeAnnotation: id })
	}

	handleZoomIn() {
		if(this.state.zoom >= mapOptions.zoomMax) return;
		this.setState({ zoom: this.state.zoom * 2 })
	}

	handleZoomOut() {
		if(this.state.zoom <= mapOptions.zoomMin) return;
		this.setState({ zoom: this.state.zoom / 2 })
	}

	handleReset() { // returns world center, not current location
		this.setState({
			center: mapOptions.centerWorld,
			zoom: 1,
		})
	}

	centerCountry(centroid) {
		this.setState({ center: centroid});
	}

	setAnnotationActive(id) {
		const isAnnotationActive = this.state.activeAnnotation === id;
		return isAnnotationActive ? 'active' : '';
	}

	render() {
		return (
			<div>
				<div>
					<button onClick={this.handleReset}>reset</button>
					<button onClick={this.handleZoomIn}>zoom in</button>
					<button onClick={this.handleZoomOut}>zoom out</button>
				</div>
				<div>
					<button>up</button>
					<button>right</button>
					<button>bottom</button>
					<button>left</button>
				</div>
				<div style={mapOptions.wrapperStyles}>
					<ComposableMap
						width={mapOptions.width}
						height={mapOptions.height}
						projection={this.state.projectionType}
						projectionConfig={{
							scale: 180
						}}
						style={{
							width: "100%",
							height: "auto",
						}}
					>
						<ZoomableGroup
							center={this.state.center}
							zoom={this.state.zoom}
							disablePanning={true}
						>
							{/* dummy graticule for water color */}
							<Graticule
								fill={mapOptions.waterColor}
								stroke={mapOptions.waterColor}
							/>

							<Geographies
								geographyPaths={this.state.geographyPaths}
								// disableOptimization
							>
								{
									(geographies, projection) =>
										geographies.map((geography, i) =>
											<Geography
												key={`country-${i}`}
												cacheId={`country-${i}`}
												id={`country-${i}`}
												round
												geography={geography}
												projection={projection}
												onClick={() => this.handleCountryClick(geography.id)}
												// onMouseEnter={() => this.handleCountryMouseEnter(geography.id)}
												>
											</Geography>
										)
								}
							</Geographies>
							<Markers>
								{
									this.state.locations.map((location, i) => {
										if (i % 5 === 0) {
											return (
												<Marker
													key={`location-${i}`}
													marker={location}
													onClick={this.handleMarkerClick}
													preserveMarkerAspect={true}
												>
													<circle
														cx={0}
														cy={0}
													>
													</circle>
													<g className={'rsm-marker-text'}>
														<text>{location.name}</text>
													</g>

												</Marker>
											)
										}
									}

									)
								}
							</Markers>
							<Annotations>
								{
									this.state.annotations.map((annotation, i) => {
											return (
												<Annotation
													key={`annotation-${i}`}
													subject={annotation.centroid}
													dx={0}
													dy={0}
													strokeWidth={0}
												>
													<g className={`rsm-annotation-text ${this.setAnnotationActive(annotation.short)}`}>
														<text>{annotation.name}</text>
													</g>

												</Annotation>
											)
										}

									)
								}
							</Annotations>
							<Graticule
								outline={false}
								round={false}
							/>

						</ZoomableGroup>
					</ComposableMap>
				</div>
			</div>
		)
	}

}

export default Map;