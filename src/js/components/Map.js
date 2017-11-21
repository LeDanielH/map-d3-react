import React, { Component } from "react";

import {
	projectionType,
	getCentroid
} from "../options/d3Options";
import '../../sass/project/components/map/_rsm-map.scss';

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

import { getClickHandler, convertDMS } from "../helpers";
import Controls from './map-controls/Controls';
import Pan from './map-controls/Pan';
import Range from './map-controls/Range';
import Zoom from './map-controls/Zoom';
import Reset from './map-controls/Reset';

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
			projectionType: () => projectionType,
			center: {
				long: 0,
				lat: 0
			},
			longMax: 20,
			longMin: -20,
			latMax: 40,
			latMin: -40,
			activeAnnotation: null,
			mapLoading: true,
			mapControlsOpen: false,
			yourLocation: {
				lat: 0,
				long: 0,
			}
		};
		this.handleReset = this.handleReset.bind(this);
		this.handleZoomIn = this.handleZoomIn.bind(this);
		this.handleZoomOut = this.handleZoomOut.bind(this);
		this.handlePan = this.handlePan.bind(this);
		this.handleRange = this.handleRange.bind(this);
		this.resetToCurrentLocation = this.resetToCurrentLocation.bind(this);
		this.goToGoogleMaps = this.goToGoogleMaps.bind(this);
		this.handleMapControls = this.handleMapControls.bind(this);
		this.handleMapControlsVisibility = this.handleMapControlsVisibility.bind(this);
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
		const newZoom = zoom * 2;
		if(zoom >= zoomMax) return;
		this.setState({zoom: newZoom}, () => this.setBoundaries(newZoom, long, lat));
	}

	handleMapControls() {
		console.log('handling map controls');
		const isMapControlsOpen = this.state.mapControlsOpen === true;
		isMapControlsOpen ? this.setState({ mapControlsOpen: false }) : this.setState({ mapControlsOpen: true })
	}

	handleMapControlsVisibility() {
		const isMapControlsOpen = this.state.mapControlsOpen === true;
		return isMapControlsOpen ? 'active' : '';
	}

	// todo handle zoomOut behaviour when focused on north or south
	handleZoomOut() {
		const {zoom, center:{long, lat}} = this.state;
		const {zoomMin} = mapOptions;
		const newZoom = zoom/2;
		if(zoom <= zoomMin) return;
		this.setState({ zoom: newZoom }, () => this.setBoundaries(newZoom, long, lat));
	}

	handleRange(event, coordType) {
		const { center } = this.state;
		if(coordType === 'lat') {
			this.setState({ center: { ...center, lat: event.target.value}})
		} else if (coordType === 'long') {
			this.setState({ center: { ...center, long: event.target.value}})
		}
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

		const { center, center: {lat, long}, longMin, longMax, latMin, latMax } = this.state;
		const { panIncrement } = mapOptions;

		switch (direction) {
			case 'left':
				if((long - panIncrement) <= longMin) {
					this.setState({ center: { ...center, long: longMin }});
				} else {
					this.setState({ center: { ...center, long: long - panIncrement }});
				}
				break;
			case 'right':
				if((long + panIncrement) >= longMax) {
					this.setState({ center: { ...center, long: longMax }});
				} else {
					this.setState({ center: { ...center, long: long + panIncrement }});
				}

				break;
			case 'up':
				if((lat + panIncrement) >= latMax) {
					this.setState({ center: { ...center, lat: latMax }});
				} else {
					this.setState({ center: { ...center, lat: lat + panIncrement }});
				}

				break;
			case 'down':
				if((lat - panIncrement) <= latMin) {
					this.setState({center: { ...center, lat: latMin }});
				} else {
					this.setState({center: { ...center, lat: lat - panIncrement }});
				}
				break;
			default:
				console.log('no direction has been specified');
		}
	}

	resetToCurrentLocation() {
		const {yourLocation: {long, lat}} = this.state;
		if (long === null || lat === null) {
			alert('Your current location is not available.');
		} else {
			const {zoomFocus} = mapOptions;
			this.setState({
				center: { long: long, lat: lat},
				zoom: zoomFocus},
				this.setBoundaries(zoomFocus, long, lat))
		}
	}

	goToGoogleMaps() {
		const gmUrl='https://www.google.cz/maps/place/';
		const {center: {long, lat}, zoom} = this.state;
		const location = convertDMS(lat, long);
		const goToLocation=`${gmUrl}${location}/@${lat},${long},${zoom}z/`;
		window.open(goToLocation, '_blank');
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
				zoom: zoomFocus,
				mapLoading: false,
				yourLocation: {
					long: longitude,
					lat: latitude
				}
			}, _this.setBoundaries(zoomFocus, longitude, latitude));

		}

		function error() {
			console.log('unable to retrieve your location');
			const {zoomMin, centerWorld: {long, lat}} = mapOptions;
			_this.setState({
				center: { long: long, lat: lat},
				zoom: zoomMin,
				mapLoading: false,
			}, _this.setBoundaries(zoomMin, long, lat));

		}

		navigator.geolocation.getCurrentPosition(success, error);
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
					longMax: 5,
					longMin: -5,
					latMax: 30,
					latMin: -30
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
					longMax: 158,
					longMin: -158,
					latMax: 86,
					latMin: -86
				}, () => this.positionMap(longitude, latitude));
				break;
			case 16:
				this.setState({
					longMax: 169,
					longMin: -169,
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
			console.log(isLessThenMarkerFocus);
			this.setState({ zoom: zoomFocus }, () => this.setBoundaries(zoomFocus, longitude, latitude));
		} else {
			this.setBoundaries(zoom, longitude, latitude);
		}
		this.setState({ activeAnnotation: null });
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
		const minZoom = zoom < zoomMin;

		if(minZoom) {
			this.setState({ zoom: zoomCountryMin }, () => this.setBoundaries(zoomCountryMin, longitude, latitude));
		} else {
			this.setBoundaries(zoom, longitude, latitude);
		}
		this.setState({ activeAnnotation: id });
	}

	handleCountryDblClick(id, center) {
		const [longitude, latitude] = [center[0], center[1]];
		const newZoom = this.state.zoom * 2;
		this.setState({
			activeAnnotation: id,
			zoom: newZoom
		}, () => this.setBoundaries(newZoom, longitude, latitude));
	}

	handleLoading() {
		const isMapLoading = this.state.mapLoading === true;
		return isMapLoading ? 'loading' : ''
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

				<div style={mapOptions.wrapperStyles} className={`rsm-map__wrapper ${this.handleLoading()}`}>
					<Controls
						handleMapControls={this.handleMapControls}
						handleMapControlsVisibility={this.handleMapControlsVisibility}
						rangeControls={
							<Range
								handleRange={this.handleRange}
								latMin={this.state.latMin}
								latMax={this.state.latMax}
								longMin={this.state.longMin}
								longMax={this.state.longMax}
								lat={this.state.center.lat}
								long={this.state.center.long}
							/>
						}
					>
						<Zoom
							handleZoomIn={this.handleZoomIn}
							handleZoomOut={this.handleZoomOut}
						/>,
						<Pan
							handlePan={this.handlePan}
						/>,
						<Reset
							handleReset={this.handleReset}
							resetToCurrentLocation={this.resetToCurrentLocation}
							goToGoogleMaps={this.goToGoogleMaps}
						/>
					</Controls>
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
								disableOptimization
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