import React from 'react';
import mapOptions from '../options/mapOptions';
const MapControls = (props) => {
	const {
		handleZoomIn,
		handleZoomOut,
		handlePan,
		handleReset,
		handleRange,
		resetToCurrentLocation,
		handleMapControls,
		handleMapControlsVisibility,
		latMin,
		latMax,
		longMin,
		longMax,
		lat,
		long,
		goToGoogleMaps,
	} = props;

	const { gmLogo } = mapOptions;
	return (
		
		<div className={`map__controls ${handleMapControlsVisibility()}`}>
			<div className={'map__controls-trigger'} onClick={handleMapControls}>
				<span>&#10148;</span>
			</div>
			<div className="map__controls-wrapper">
				<div className="map__compass">
					<div className={'map__zoom'}>
						<div className={'map__zoom-btn'} onClick={handleZoomIn}><span>+</span></div>
						<div className={'map__zoom-btn'} onClick={handleZoomOut}><span>-</span></div>
					</div>
					<div className={'map__pan'}>
						<div className={'map__pan-btn'} onClick={() => handlePan('up')}/>
						<div className={'map__pan-btn'} onClick={() => handlePan('right')}/>
						<div className={'map__pan-btn'} onClick={() => handlePan('down')}/>
						<div className={'map__pan-btn'} onClick={() => handlePan('left')}/>
					</div>
					<div className={"map__reset"}>
						<div onClick={handleReset} className={'map__reset-btn to-map'}>
							<span>&#8634;</span>
						</div>
						<div onClick={resetToCurrentLocation} className={'map__reset-btn to-myplace'} />
						<div onClick={goToGoogleMaps} className={'map__reset-btn to-gmap'} >
							<img src={gmLogo} alt="google maps logo"/>
						</div>
					</div>
				</div>

				<div className="map__range">
					<div className="map__range-wrapper">
						<input type="range"
						       min={latMin}
						       max={latMax}
						       value={parseFloat(lat)}
						       step={parseInt(2)}
						       onChange={(e) => handleRange(e, 'lat')}
						/>
					</div>
					<div className="map__range-wrapper">
						<input type="range"
						       min={longMin}
						       max={longMax}
						       value={parseFloat(long)}
						       step={parseInt(2)}
						       onChange={(e) => handleRange(e, 'long')}
						/>
					</div>
				</div>
			</div>
		</div>
	)
};

export default MapControls;