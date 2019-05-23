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
        this.getView().addInteraction('Polygon');
    },

    setMapState: function (lat, lon, zoom) {
        this.getView().getMapView().setCenter(ol.proj.fromLonLat([lon, lat]));
        this.getView().getMapView().setZoom(zoom);
    }
});
