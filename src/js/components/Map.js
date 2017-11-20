import React, { Component } from "react";

import {
	projectionForCentroids,
	pathForCentroids,
	getCentroid
} from "../options/d3Options";

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

import { getClickHandler } from "../helpers";


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
			zoom: 1,
			geographyPaths: [],
			locations: [],
			annotations: [],
			projectionType: () => projectionForCentroids,
			center: {
				long: 0,
				lat: 0
			},
			longMax: 20,
			longMin: -20,
			latMax: 40,
			latMin: -40,
			activeAnnotation: null
		};

		this.handleReset = this.handleReset.bind(this);
		this.handleZoomIn = this.handleZoomIn.bind(this);
		this.handleZoomOut = this.handleZoomOut.bind(this);
	}

	componentWillMount() {
		this.loadPaths();
		this.loadLocations();
		this.loadAnnotations();
		this.geoFindMe();
	}

	geoFindMe() {
		const _this = this;

		if (!navigator.geolocation){
			console.log('geolocation is not supported by your browser');
			return;
		}

		function success(position) {
			_this.setState({
				center: {
					long: position.coords.longitude,
					lat: position.coords.latitude
				},
				zoom: mapOptions.zoomFocus
			}, _this.setBoundaries(mapOptions.zoomFocus, position.coords.longitude, position.coords.latitude));

		}

		function error() {
			console.log('unable to retrieve your location');
			_this.setState({
				center: {
					long: mapOptions.centerWorld.long,
					lat: mapOptions.centerWorld.lat
				},
				zoom: mapOptions.zoomMin
			}, _this.setBoundaries(mapOptions.zoomMin, mapOptions.centerWorld.long, mapOptions.centerWorld.lat));

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
				coordinates: [parseFloat(city.CapitalLongitude), parseFloat(city.CapitalLatitude)]
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

	positionMap(longitude, latitude) {

		const longMin = this.state.longMin;
		const longMax = this.state.longMax;
		const latMin = this.state.latMin;
		const latMax = this.state.latMax;

		const isLessThanLongMin = longitude < longMin;
		const isMoreThanLongMax = longitude > longMax;
		const isLessThanLatMin = latitude < latMin;
		const isMoreThanLatMax = latitude > latMax;

		function getLongitude() {
			if(isLessThanLongMin) {
				return longMin
			} else if(isMoreThanLongMax) {
				return longMax
			} else {
				return longitude
			}
		}

		function getLatitude() {
			if(isLessThanLatMin) {
				return latMin
			} else if(isMoreThanLatMax) {
				return latMax
			} else {
				return latitude
			}
		}

		this.setState({
			center: {
				long: getLongitude(),
				lat: getLatitude()
			}
		});
	}

	// todo figure out how not to hard code these values for each zoom state
	setBoundaries(zoom, longitude, latitude) {
		switch (zoom) {
			case 1:
				this.setState({
					longMax: 15,
					longMin: -15,
					latMax: 40,
					latMin: -40
				}, () => this.positionMap(longitude, latitude));
				break;
			case 2:
				this.setState({
					longMax: 92,
					longMin: -92,
					latMax: 65,
					latMin: -65
				}, () => this.positionMap(longitude, latitude));
				break;
			case 4:
				this.setState({
					longMax: 135,
					longMin: -135,
					latMax: 80,
					latMin: -80
				}, () => this.positionMap(longitude, latitude));
				break;

			case 8:
				this.setState({
					longMax: 154,
					longMin: -154,
					latMax: 86,
					latMin: -86
				}, () => this.positionMap(longitude, latitude));
				break;
			case 16:
				this.setState({
					longMax: 164,
					longMin: -164,
					latMax: 88,
					latMin: -88
				}, () => this.positionMap(longitude, latitude));
				break;

		}
	}

	handleMarkerClick(location) {
		const longitude = location.coordinates[0];
		const latitude = location.coordinates[1];
		const isLessThenMarkerFocus = this.state.zoom < mapOptions.zoomFocus;

		if(isLessThenMarkerFocus) {
			this.setState({
				zoom: mapOptions.zoomFocus,
			}, () => this.setBoundaries(mapOptions.zoomFocus, longitude, latitude));
		}

		this.setState({
			activeAnnotation: null
		});

		this.setBoundaries(this.state.zoom, longitude, latitude);
	}

	handleMarkerDblClick(location) {
		const longitude = location.coordinates[0];
		const latitude = location.coordinates[1];
		const newZoom = this.state.zoom;
		this.setState({
			zoom: newZoom
		}, () => this.setBoundaries(newZoom, longitude, latitude));


	}

	handleCountryClick(id, center) {
		const longitude = center[0];
		const latitude = center[1];
		const minZoom = this.state.zoom <= mapOptions.zoomMin;

		if(minZoom) {
			this.setState({
				zoom: mapOptions.zoomCountryMin
			}, () => this.setBoundaries(mapOptions.zoomCountryMin, longitude, latitude));

		}
		this.setState({activeAnnotation: id,});
		this.setBoundaries(this.state.zoom, longitude, latitude);
	}

	handleCountryDblClick(id, center) {
		const longitude = center[0];
		const latitude = center[1];
		const newZoom = this.state.zoom * 2;
		this.setState({
			activeAnnotation: id,
			zoom: newZoom
		}, () => this.setBoundaries(newZoom, longitude, latitude));


	}

	handleZoomIn() {
		const isBiggerThanMax = this.state.zoom >= mapOptions.zoomMax;
		if(isBiggerThanMax) return;
		const newZoom = this.state.zoom * 2;
		this.setState({ zoom: newZoom });
	}

	handleZoomOut() {
		const isSmallerThanMin = this.state.zoom <= mapOptions.zoomMin;
		if(isSmallerThanMin) return;
		const newZoom = this.state.zoom / 2;
		this.setState({ zoom: newZoom });
	}

	handleReset() { // returns world center, not current location
		this.setState({
			zoom: mapOptions.zoomMin,
			activeAnnotation: null,
			center: {
				long: mapOptions.centerWorld.long,
				lat: mapOptions.centerWorld.lat
			}
		}, () => this.setBoundaries(mapOptions.zoomMin, mapOptions.centerWorld.long, mapOptions.centerWorld.lat));
	}

	setAnnotationActive(id) {
		const isAnnotationActive = this.state.activeAnnotation === id;
		return isAnnotationActive ? 'active' : '';
	}

	pan(direction) {
		const currentLat = this.state.center.lat;
		const currentLong = this.state.center.long;
		const increment = 10;

		switch (direction) {
			case 'left':
				this.setState({
					center: {
						...this.state.center,
						long: currentLong - increment,
					}
				});
				break;
			case 'right':
				this.setState({
					center: {
						...this.state.center,
						long: currentLong + increment,
					}
				});
				break;
			case 'up':
				this.setState({
					center: {
						...this.state.center,
						lat: currentLat + increment,
					}
				});
				break;
			case 'down':
				this.setState({
					center: {
						...this.state.center,
						lat: currentLat - increment,
					}
				});
				break;
			default:
				console.log('no direction has been specified');
		}

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
					<button onClick={() => this.pan('up')}>up</button>
					<button onClick={() => this.pan('right')}>right</button>
					<button onClick={() => this.pan('down')}>bottom</button>
					<button onClick={() => this.pan('left')}>left</button>
				</div>
				<div style={mapOptions.wrapperStyles} className={'rsm-wrapper'}>
					<ComposableMap
						width={mapOptions.width}
						height={mapOptions.height}
						projection={this.state.projectionType}
						projectionConfig={mapOptions.projectionConfig}
						style={{
							width: "100%",
							height: "auto",
						}}
					>
						<ZoomableGroup
							center={[this.state.center.long, this.state.center.lat]}
							zoom={this.state.zoom}
							disablePanning={true}
							// onMoveEnd={this.handleMoveEnd}
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
										geographies.map((geography, i) => {
											const centroid = getCentroid(geography);
											return (
												<Geography

													key={`country-${i}`}
													cacheId={`country-${i}`}
													id={`country-${i}`}
													round
													geography={geography}
													projection={projection}
													// onClick={() => this.handleCountryClick(geography.id, centroid)}
													// onMouseEnter={() => this.handleCountryMouseEnter(geography.id)}
													onClick={getClickHandler(
														()=> this.handleCountryClick(geography.id, centroid),
														()=> this.handleCountryDblClick(geography.id, centroid))
													}
													>
												</Geography>
											)}
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
													onClick={getClickHandler(
														()=> this.handleMarkerClick(location),
														()=> this.handleMarkerDblClick(location))
													}
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