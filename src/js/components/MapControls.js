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
		latMin,
		latMax,
		longMin,
		longMax,
		lat,
		long
	} = props;

	const { zoomMin, zoomMax, panIncrement } = mapOptions;
	return (
		
		<div className={"map__controls"}>
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
				<div onClick={resetToCurrentLocation} className={'map__myplace'} />
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

			<div className={"map__reset"}>
				<button className={'map__reset-btn'} onClick={handleReset}></button>
			</div>

		</div>
	)
};

export default MapControls;