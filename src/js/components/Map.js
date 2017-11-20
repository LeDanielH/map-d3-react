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
import MapControls from './MapControls';


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
		this.handlePan = this.handlePan.bind(this);
	}

	componentWillMount() {
		this.loadPaths();
		this.loadLocations();
		this.loadAnnotations();
		this.geoFindMe();
	}

	handleZoomIn() {
		const {zoom, center: {long, lat}} = this.state;
		const {zoomMax} = mapOptions;
		if(zoom >= zoomMax) return;
		this.setState({zoom: zoom * 2}, () => this.setBoundaries(zoom, long, lat));
	}

	// todo handle zoomOut behaviour when focused on north or south
	handleZoomOut() {
		const {zoom, center:{long, lat}} = this.state;
		const {zoomMin} = mapOptions;
		if(zoom <= zoomMin) return;
		this.setState({ zoom: zoom / 2 }, () => this.setBoundaries(zoom, long, lat));
	}

	handleReset() { // returns world center, not current location
		const {zoomMin, centerWorld: {long, lat}} = mapOptions;
		this.setState({
			zoom: zoomMin,
			activeAnnotation: null,
			center: {
				long: long,
				lat: lat
			}
		}, () => this.setBoundaries(zoomMin, long, lat));
	}
	handlePan(direction) {

		const { center: {lat, long}, longMin, longMax, latMin, latMax } = this.state;
		const { panIncrement } = mapOptions;

		switch (direction) {
			case 'left':
				if(currentLong < longMin) return;
				this.setState({ center: { ...center, long: long - panIncrement }});
				break;
			case 'right':
				if(currentLong > longMax) return;
				this.setState({ center: { ...center, long: long + panIncrement }});
				break;
			case 'up':
				if(currentLat > latMax) return;
				this.setState({ center: { ...center, lat: lat + panIncrement }});
				break;
			case 'down':
				if(currentLat < latMin) return;
				this.setState({center: { ...center, lat: lat - panIncrement }});
				break;
			default:
				console.log('no direction has been specified');
		}
	}

	geoFindMe() {
		const _this = this;

		if (!navigator.geolocation){
			console.log('geolocation is not supported by your browser');
			return;
		}

		function success(position) {
			const {longitude, latitude} = position.coords;
			const {zoomFocus} = mapOptions;
			_this.setState({
				center: {long: longitude, lat: latitude},
				zoom: zoomFocus
			}, _this.setBoundaries(zoomFocus, longitude, latitude));

		}

		function error() {
			console.log('unable to retrieve your location');
			const {zoomMin, centerWorld: {long, lat}} = mapOptions;
			_this.setState({
				center: { long: long, lat: lat},
				zoom: zoomMin
			}, _this.setBoundaries(zoomMin, long, lat));

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

		const {longMin, longMax, latMin, latMax} = this.state;

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
			center: {long: getLongitude(), lat: getLatitude()}
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
		const [longitude, latitude] = [location.coordinates[0], location.coordinates[1]];
		const {zoomFocus} = mapOptions;
		const {zoom} = this.state;
		const isLessThenMarkerFocus = zoom < zoomFocus;

		if(isLessThenMarkerFocus) {
			this.setState({ zoom: zoomFocus }, () => this.setBoundaries(zoomFocus, longitude, latitude));
		}

		this.setState({ activeAnnotation: null });
		this.setBoundaries(zoom, longitude, latitude);
	}

	handleMarkerDblClick(location) {
		const [longitude, latitude] = [location.coordinates[0], location.coordinates[1]];
		const newZoom = this.state.zoom * 2;
		this.setState({ zoom: newZoom }, () => this.setBoundaries(newZoom, longitude, latitude));
	}

	handleCountryClick(id, center) {
		const [longitude, latitude] = [center[0], center[1]];
		const {zoom} = this.state;
		const {zoomMin, zoomCountryMin} = mapOptions;
		const minZoom = zoom <= zoomMin;

		if(minZoom) {
			this.setState({ zoom: zoomCountryMin }, () => this.setBoundaries(zoomCountryMin, longitude, latitude));
		}

		this.setState({ activeAnnotation: id });
		this.setBoundaries(zoom, longitude, latitude);
	}

	handleCountryDblClick(id, center) {
		const [longitude, latitude] = [center[0], center[1]];
		const newZoom = this.state.zoom * 2;
		this.setState({
			activeAnnotation: id,
			zoom: newZoom
		}, () => this.setBoundaries(newZoom, longitude, latitude));
	}

	setAnnotationActive(id) {
		const isAnnotationActive = this.state.activeAnnotation === id;
		return isAnnotationActive ? 'active' : '';
	}

	getCenter() {
		const {long, lat} = this.state.center;
		return [long, lat];
	}

	getZoom() {
		const {zoom} = this.state;
		return zoom;
	}

	render() {
		return (
			<div className={'rsm'}>

				<MapControls
					handleZoomIn={this.handleZoomIn}
					handleZoomOut={this.handleZoomOut}
					handlePan={this.handlePan}
					handleReset={this.handleReset}
				/>

				<div style={mapOptions.wrapperStyles} className={'rsm-map__wrapper'}>
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
							center={this.getCenter()}
							zoom={this.getZoom()}
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
									})
								}
							</Markers>
							<Annotations>
								{
									this.state.annotations.map((annotation, i) => {
										const {short, name} = annotation;
											return (
												<Annotation
													key={`annotation-${i}`}
													subject={annotation.centroid}
													dx={0}
													dy={0}
													strokeWidth={0}
												>
													<g className={`rsm-annotation-text ${this.setAnnotationActive(short)}`}>
														<text>{name}</text>
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