import React from 'react';
import mapOptions from "../../options/mapOptions";
import '../../../sass/project/components/controls/_reset.scss';

const Reset = (props) => {

	const { handleReset, resetToCurrentLocation, goToGoogleMaps} = props;
	const { gmLogo } = mapOptions;

	return (
		<div className={"map__reset"}>
			<div onClick={handleReset} className={'map__reset-btn to-map'}>
				<span>&#8634;</span>
			</div>
			<div onClick={resetToCurrentLocation} className={'map__reset-btn to-myplace'} />
			<div onClick={goToGoogleMaps} className={'map__reset-btn to-gmap'} >
				<img src={gmLogo} alt="google maps logo"/>
			</div>
		</div>
	)
};

export default Reset;