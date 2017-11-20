import React, { Component } from 'react';
import mapOptions from '../options/mapOptions';


class MapControls extends Component {
	constructor() {
		super()
	}

	render() {
		const {handleZoomIn, handleZoomOut, handlePan, handleReset} = this.props;
		return (
			<div className={"rsm-controls"}>
				<div className={'rsm-controls__zoom'}>
					<div onClick={handleZoomIn}>zoom in</div>
					<div onClick={handleZoomOut}>zoom out</div>
				</div>
				<div className={'rsm-controls__pan'}>
					<div onClick={() => handlePan('up')}>up</div>
					<div onClick={() => handlePan('right')}>right</div>
					<div onClick={() => handlePan('down')}>bottom</div>
					<div onClick={() => handlePan('left')}>left</div>
				</div>
				<div className={"rsm-controls__reset"}>
					<div onClick={handleReset}>reset</div>
				</div>
			</div>
		)
	}
}

export default MapControls;