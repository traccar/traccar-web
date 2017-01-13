/*
 * Copyright 2015 - 2017 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.MapController', {
    extend: 'Traccar.view.MapMarkerController',
    alias: 'controller.map',

    requires: [
        'Traccar.GeofenceConverter'
    ],

    config: {
        listen: {
            controller: {
                '*': {
                    mapstaterequest: 'getMapState',
                    togglestaterequest: 'getToggleState'
                }
            },
            store: {
                '#Geofences': {
                    load: 'updateGeofences',
                    add: 'updateGeofences',
                    update: 'updateGeofences',
                    remove: 'updateGeofences'
                }
            }
        }
    },

    init: function () {
        this.callParent();
        this.lookupReference('showReportsButton').setVisible(Traccar.app.isMobile());
        this.lookupReference('deviceFollowButton').setPressed(
                Traccar.app.getAttributePreference('web.followToggle', 'false') === 'true');
        this.lookupReference('showGeofencesButton').setPressed(
                Traccar.app.getAttributePreference('web.geofenceToggle', 'true') === 'true');
        this.lookupReference('showLiveRoutes').setPressed(
                Traccar.app.getAttributePreference('web.liveRouteToggle', 'false') === 'true');
        Ext.getCmp('muteButton').setPressed(
                Traccar.app.getAttributePreference('web.muteToggle', 'true') === 'true');
    },

    showReports: function () {
        Traccar.app.showReports(true);
    },

    onFollowClick: function (button, pressed) {
        if (pressed && this.selectedMarker) {
            this.getView().getMapView().setCenter(this.selectedMarker.getGeometry().getCoordinates());
        }
    },

    showLiveRoutes: function (button) {
        this.getView().getLiveRouteLayer().setVisible(button.pressed);
    },

    getMapState: function () {
        var zoom, center, projection;
        projection = this.getView().getMapView().getProjection();
        center = ol.proj.transform(this.getView().getMapView().getCenter(), projection, 'EPSG:4326');
        zoom = this.getView().getMapView().getZoom();
        this.fireEvent('mapstate', center[1], center[0], zoom);
    },

    getToggleState: function () {
        var state = {};
        state['web.followToggle'] = this.lookupReference('deviceFollowButton').pressed.toString();
        state['web.geofenceToggle'] = this.lookupReference('showGeofencesButton').pressed.toString();
        state['web.liveRouteToggle'] = this.lookupReference('showLiveRoutes').pressed.toString();
        state['web.muteToggle'] = Ext.getCmp('muteButton').pressed.toString();
        this.fireEvent('togglestate', state);
    },

    getGeofenceStyle: function (label, color) {
        var fillColor, strokeColor;
        if (color) {
            fillColor = ol.color.asArray(color);
            strokeColor = color;
        } else {
            fillColor = ol.color.asArray(Traccar.Style.mapGeofenceColor);
            strokeColor = Traccar.Style.mapGeofenceColor;
        }
        fillColor[3] = Traccar.Style.mapGeofenceOverlayOpacity;
        return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: fillColor
                }),
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: Traccar.Style.mapGeofenceWidth
                }),
                text: new ol.style.Text({
                    text: label,
                    fill: new ol.style.Fill({
                        color: Traccar.Style.mapGeofenceTextColor
                    }),
                    stroke: new ol.style.Stroke({
                        color: Traccar.Style.mapTextStrokeColor,
                        width: Traccar.Style.mapTextStrokeWidth
                    }),
                    font : Traccar.Style.mapTextFont
                })
            });
    },

    updateGeofences: function () {
        this.getView().getGeofencesSource().clear();
        if (this.lookupReference('showGeofencesButton').pressed) {
            Ext.getStore('Geofences').each(function (geofence) {
                var feature = new ol.Feature(Traccar.GeofenceConverter
                        .wktToGeometry(this.getView().getMapView(), geofence.get('area')));
                feature.setStyle(this.getGeofenceStyle(geofence.get('name'),
                        geofence.get('attributes') ? geofence.get('attributes').color : null));
                this.getView().getGeofencesSource().addFeature(feature);
                return true;
            }, this);
        }
    }
});
