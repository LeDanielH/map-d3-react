import React from 'react';

const MapControls = (props) => {
	const {handleZoomIn, handleZoomOut, handlePan, handleReset} = props;
	return (
		<div className={"map__controls"}>
			<div className={'map__zoom'}>
				<div className={'map__zoom-btn'} onClick={handleZoomIn}>+</div>
				<div className={'map__zoom-btn'} onClick={handleZoomOut}>-</div>
			</div>
			<div className={'map__pan'}>
				<div className={'map__pan-btn'} onClick={() => handlePan('up')}/>
				<div className={'map__pan-btn'} onClick={() => handlePan('right')}/>
				<div className={'map__pan-btn'} onClick={() => handlePan('down')}/>
				<div className={'map__pan-btn'} onClick={() => handlePan('left')}/>
			</div>
			<div className={"map__reset"}>
				<div className={'map__reset-btn'} onClick={handleReset}>reset</div>
			</div>
		</div>
	)
};

export default MapControls;