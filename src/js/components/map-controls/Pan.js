import React from 'react';
import '../../../sass/project/components/controls/_pan.scss';

const Pan = (props) => {

	const { handlePan } = props;

	return (
		<div className={'map__pan'}>
			<div className={'map__pan-btn'} onClick={() => handlePan('up')}/>
			<div className={'map__pan-btn'} onClick={() => handlePan('right')}/>
			<div className={'map__pan-btn'} onClick={() => handlePan('down')}/>
			<div className={'map__pan-btn'} onClick={() => handlePan('left')}/>
		</div>
	)
};

export default Pan;