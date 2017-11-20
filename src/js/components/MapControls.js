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
					<button onClick={handleZoomIn}>zoom in</button>
					<button onClick={handleZoomOut}>zoom out</button>
				</div>
				<div className={'rsm-controls__pan'}>
					<button onClick={() => handlePan('up')}>up</button>
					<button onClick={() => handlePan('right')}>right</button>
					<button onClick={() => handlePan('down')}>bottom</button>
					<button onClick={() => handlePan('left')}>left</button>
				</div>
				<div className={"rsm-controls__reset"}>
					<button onClick={handleReset}>reset</button>
				</div>
			</div>
		)
	}
}

export default MapControls;