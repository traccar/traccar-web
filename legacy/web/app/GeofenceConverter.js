/*
 * Copyright 2016 Anton Tananaev (anton@traccar.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('Traccar.GeofenceConverter', {
    singleton: true,

    wktToGeometry: function (mapView, wkt) {
        var geometry, projection, resolutionAtEquator, pointResolution, resolutionFactor,
            points = [], center, radius, content, i, lat, lon, coordinates;
        if (wkt.lastIndexOf('POLYGON', 0) === 0) {
            content = wkt.match(/\([^()]+\)/);
            if (content !== null) {
                coordinates = content[0].match(/-?\d+\.?\d*/g);
                if (coordinates !== null) {
                    projection = mapView.getProjection();
                    for (i = 0; i < coordinates.length; i += 2) {
                        lat = Number(coordinates[i]);
                        lon = Number(coordinates[i + 1]);
                        points.push(ol.proj.transform([lon, lat], 'EPSG:4326', projection));
                    }
                    geometry = new ol.geom.Polygon([points]);
                }
            }
        } else if (wkt.lastIndexOf('CIRCLE', 0) === 0) {
            content = wkt.match(/\([^()]+\)/);
            if (content !== null) {
                coordinates = content[0].match(/-?\d+\.?\d*/g);
                if (coordinates !== null) {
                    projection = mapView.getProjection();
                    center = ol.proj.transform([Number(coordinates[1]), Number(coordinates[0])], 'EPSG:4326', projection);
                    resolutionAtEquator = mapView.getResolution();
                    pointResolution = ol.proj.getPointResolution(projection, resolutionAtEquator, center);
                    resolutionFactor = resolutionAtEquator / pointResolution;
                    radius = Number(coordinates[2]) / ol.proj.Units.METERS_PER_UNIT.m * resolutionFactor;
                    geometry = new ol.geom.Circle(center, radius);
                }
            }
        } else if (wkt.lastIndexOf('LINESTRING', 0) === 0) {
            content = wkt.match(/\([^()]+\)/);
            if (content !== null) {
                coordinates = content[0].match(/-?\d+\.?\d*/g);
                if (coordinates !== null) {
                    projection = mapView.getProjection();
                    for (i = 0; i < coordinates.length; i += 2) {
                        lat = Number(coordinates[i]);
                        lon = Number(coordinates[i + 1]);
                        points.push(ol.proj.transform([lon, lat], 'EPSG:4326', projection));
                    }
                    geometry = new ol.geom.LineString(points);
                }
            }
        }
        return geometry;
    },

    geometryToWkt: function (projection, geometry) {
        var result, i, center, radius, edgeCoordinate, groundRadius, points;
        if (geometry instanceof ol.geom.Circle) {
            center = geometry.getCenter();
            radius = geometry.getRadius();
            edgeCoordinate = [center[0] + radius, center[1]];
            center = ol.proj.transform(center, projection, 'EPSG:4326');
            groundRadius = ol.sphere.getDistance(
                center, ol.proj.transform(edgeCoordinate, projection, 'EPSG:4326'), 6378137);
            result = 'CIRCLE (';
            result += center[1] + ' ' + center[0] + ', ';
            result += groundRadius.toFixed(1) + ')';
        } else if (geometry instanceof ol.geom.Polygon) {
            geometry.transform(projection, 'EPSG:4326');
            points = geometry.getCoordinates();
            result = 'POLYGON((';
            for (i = 0; i < points[0].length; i += 1) {
                result += points[0][i][1] + ' ' + points[0][i][0] + ', ';
            }
            result = result.substring(0, result.length - 2) + '))';
        } else if (geometry instanceof ol.geom.LineString) {
            geometry.transform(projection, 'EPSG:4326');
            points = geometry.getCoordinates();
            result = 'LINESTRING (';
            for (i = 0; i < points.length; i += 1) {
                result += points[i][1] + ' ' + points[i][0] + ', ';
            }
            result = result.substring(0, result.length - 2) + ')';
        }
        return result;
    }
});
