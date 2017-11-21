import mapOptions from './mapOptions';
import { geoPath } from 'd3-geo';
import { geoMiller } from 'd3-geo-projection';

export const projectionType = geoMiller() // same as the one for react-simple-maps
	.scale(mapOptions.projectionConfig.scale)
	.translate([
		mapOptions.projectionConfig.xOffset + mapOptions.width / 2,
		mapOptions.projectionConfig.yOffset + mapOptions.height / 2
	])
	.rotate(mapOptions.projectionConfig.rotation)
	.precision(mapOptions.projectionConfig.precision);

export const pathForCentroids = geoPath().projection(projectionType);

export function getCentroid(geoJsonObject) {
	return projectionType.invert(pathForCentroids.centroid(geoJsonObject));
}