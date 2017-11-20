import React from 'react';

const MapControls = (props) => {
	const {handleZoomIn, handleZoomOut, handlePan, handleReset} = props;
	return (
		<div className={"map__controls"}>
			<div className={'map__zoom'}>
				<div className={'map__controls-btn'} onClick={handleZoomIn}>zoom in</div>
				<div className={'map__controls-btn'} onClick={handleZoomOut}>zoom out</div>
			</div>
			<div className={'map__pan'}>
				<div className={'map__controls-btn'} onClick={() => handlePan('up')}>up</div>
				<div className={'map__controls-btn'} onClick={() => handlePan('right')}>right</div>
				<div className={'map__controls-btn'} onClick={() => handlePan('down')}>bottom</div>
				<div className={'map__controls-btn'} onClick={() => handlePan('left')}>left</div>
			</div>
			<div className={"map__reset"}>
				<div className={'map__controls-btn'} onClick={handleReset}>reset</div>
			</div>
		</div>
	)
};

export default MapControls;