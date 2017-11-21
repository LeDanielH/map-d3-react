import React from 'react';

const Zoom = (props) => {

	const { handleZoomIn, handleZoomOut } = props;

	return (
		<div className={'map__zoom'}>
			<div className={'map__zoom-btn'} onClick={handleZoomIn}><span>+</span></div>
			<div className={'map__zoom-btn'} onClick={handleZoomOut}><span>-</span></div>
		</div>
	)
};

export default Zoom;