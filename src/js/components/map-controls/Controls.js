import React from 'react';

const Controls = (props) => {

	const { handleMapControlsVisibility, handleMapControls } = props;

	return (
		<div className={`map__controls ${handleMapControlsVisibility()}`}>
			<div className={'map__controls-trigger'} onClick={handleMapControls}>
				<span>&#10148;</span>
			</div>
			<div className="map__controls-wrapper">
				<div className="map__compass">
					{ props.children }
				</div>
				{ props.rangeControls }
			</div>
		</div>
	)
};

export default Controls;