import React, { Component } from 'react';
import mapOptions from '../options/mapOptions';


class MapControls extends Component {
	constructor() {
		super()
	}

	render() {
		const {handleZoomIn, handleZoomOut, pan, handleReset} = this.props;
		return (
			<div className={"rsm-controls"}>
				<div className={'rsm-controls__zoom'}>
					<button onClick={handleZoomIn}>zoom in</button>
					<button onClick={handleZoomOut}>zoom out</button>
				</div>
				<div className={'rsm-controls__pan'}>
					<button onClick={() => pan('up')}>up</button>
					<button onClick={() => pan('right')}>right</button>
					<button onClick={() => pan('down')}>bottom</button>
					<button onClick={() => pan('left')}>left</button>
				</div>
				<div className={"rsm-controls__reset"}>
					<button onClick={handleReset}>reset</button>
				</div>
			</div>
		)
	}
}

export default MapControls;