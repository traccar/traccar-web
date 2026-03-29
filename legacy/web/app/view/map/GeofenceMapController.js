/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.map.GeofenceMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.geofenceMap',

    requires: [
        'Traccar.GeofenceConverter'
    ],

    config: {
        listen: {
            controller: {
                '*': {
                    mapstate: 'setMapState'
                }
            }
        }
    },

    onFileChange: function (fileField) {
        var reader, view = this.getView();
        if (fileField.fileInputEl.dom.files.length > 0) {
            reader = new FileReader();
            reader.onload = function () {
                var parser, xml, segment, projection, points = [];
                parser = new DOMParser();
                xml = parser.parseFromString(reader.result, 'text/xml');
                segment = xml.getElementsByTagName('trkseg')[0];
                projection = view.mapView.getProjection();
                Array.from(segment.getElementsByTagName('trkpt')).forEach(function (point) {
                    var lat, lon;
                    lat = Number(point.getAttribute('lat'));
                    lon = Number(point.getAttribute('lon'));
                    points.push(ol.proj.transform([lon, lat], 'EPSG:4326', projection));
                });
                view.getFeatures().clear();
                view.getFeatures().push(new ol.Feature(new ol.geom.LineString(points)));
            };
            reader.onerror = function (event) {
                Traccar.app.showError(event.target.error);
            };
            reader.readAsText(fileField.fileInputEl.dom.files[0]);
        }
    },

    onSaveClick: function (button) {
        var geometry, projection;
        if (this.getView().getFeatures().getLength() > 0) {
            geometry = this.getView().getFeatures().pop().getGeometry();
            projection = this.getView().getMapView().getProjection();
            this.fireEvent('savearea', Traccar.GeofenceConverter.geometryToWkt(projection, geometry));
            button.up('window').close();
        }
    },

    onCancelClick: function (button) {
        button.up('window').close();
    },

    onTypeSelect: function (combo) {
        this.getView().removeInteraction();
        this.getView().addInteraction(combo.getValue());
    },

    setMapState: function (lat, lon, zoom) {
        this.getView().getMapView().setCenter(ol.proj.fromLonLat([lon, lat]));
        this.getView().getMapView().setZoom(zoom);
    }
});
