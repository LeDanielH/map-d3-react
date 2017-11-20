import mapOptions from './options/mapOptions';

export function responsivefy(svg) {
    // get container + svg aspect ratio
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMid")
        .call(resize);

    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        const targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}

export function getClickHandler(onClick, onDoubleClick, delay) {
	let timeoutID = null;
	delay = delay || mapOptions.dblClickDelay;
	return function (event) {
		if (!timeoutID) {
			timeoutID = setTimeout(() => {
				onClick(event);
				timeoutID = null
			}, delay);
		} else {
			timeoutID = clearTimeout(timeoutID);
			onDoubleClick(event);
		}
	};
}