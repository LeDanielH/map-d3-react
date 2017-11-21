import React from 'react';
import mapOptions from '../../options/mapOptions';
import '../../../sass/project/components/controls/_range.scss';

const Range = (props) => {

	const { latMin, latMax, lat, longMin, longMax, long, handleRange } = props;
	const {rangeIncrement} = mapOptions;

	return (
		<div className="map__range">
			<div className="map__range-wrapper">
				<input type="range"
				       min={latMin}
				       max={latMax}
				       value={parseFloat(lat)}
				       step={parseInt(rangeIncrement)}
				       onChange={(e) => handleRange(e, 'lat')}
				/>
			</div>
			<div className="map__range-wrapper">
				<input type="range"
				       min={longMin}
				       max={longMax}
				       value={parseFloat(long)}
				       step={parseInt(rangeIncrement)}
				       onChange={(e) => handleRange(e, 'long')}
				/>
			</div>
		</div>
	)
};

export default Range;