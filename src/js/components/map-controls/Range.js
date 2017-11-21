import React from 'react';

const Range = (props) => {

	const { latMin, latMax, lat, longMin, longMax, long, handleRange } = props;

	return (
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
	)
};

export default Range;