/*
 * Copyright 2015 - 2016 Anton Tananaev (anton@traccar.org)
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
    extend: 'Ext.app.ViewController',
    alias: 'controller.map',

    requires: [
        'Traccar.model.Position',
        'Traccar.model.Device',
        'Traccar.GeofenceConverter',
        'Traccar.DeviceImages'
    ],

    config: {
        listen: {
            controller: {
                '*': {
                    selectdevice: 'selectDevice',
                    selectreport: 'selectReport',
                    mapstaterequest: 'getMapState'
                }
            },
            store: {
                '#Devices': {
                    add: 'updateDevice',
                    update: 'updateDevice'
                },
                '#LatestPositions': {
                    add: 'updateLatest',
                    update: 'updateLatest'
                },
                '#ReportRoute': {
                    load: 'loadReport',
                    clear: 'clearReport'
                },
                '#Geofences': {
                    load: 'showGeofences',
                    add: 'updateGeofences',
                    update: 'updateGeofences',
                    remove: 'updateGeofences'
                }
            },
            component: {
                '#': {
                    selectfeature: 'selectFeature'
                }
            }
        }
    },

    init: function () {
        this.latestMarkers = {};
        this.reportMarkers = {};
        this.liveRoutes = {};
        this.liveRouteLength = Traccar.app.getAttributePreference('web.liveRouteLength', 10);
        this.lookupReference('showReportsButton').setVisible(Traccar.app.isMobile());
    },

    showReports: function () {
        Traccar.app.showReports(true);
    },

    getDeviceColor: function (device) {
        switch (device.get('status')) {
            case 'online':
                return Traccar.Style.mapColorOnline;
            case 'offline':
                return Traccar.Style.mapColorOffline;
            default:
                return Traccar.Style.mapColorUnknown;
        }
    },

    updateDevice: function (store, data) {
        var i, device, deviceId, marker, style;

        if (!Ext.isArray(data)) {
            data = [data];
        }

        for (i = 0; i < data.length; i++) {
            device = data[i];
            deviceId = device.get('id');

            if (deviceId in this.latestMarkers) {
                marker = this.latestMarkers[deviceId];
                style = marker.getStyle();
                if (style.getImage().fill !== this.getDeviceColor(device) ||
                        style.getImage().category !== device.get('category')) {
                    Traccar.DeviceImages.changeImageColor(style.getImage(),
                            this.getDeviceColor(device), device.get('category'));
                    marker.changed();
                }
                if (style.getText().getText() !== device.get('name')) {
                    style.getText().setText(device.get('name'));
                    marker.changed();
                }
            }
        }
    },

    onFollowClick: function (button, pressed) {
        if (pressed && this.selectedMarker) {
            this.getView().getMapView().setCenter(this.selectedMarker.getGeometry().getCoordinates());
        }
    },

    showLiveRoutes: function (button) {
        this.getView().getLiveRouteLayer().setVisible(button.pressed);
    },

    updateLatest: function (store, data) {
        var i, position, device;

        if (!Ext.isArray(data)) {
            data = [data];
        }

        for (i = 0; i < data.length; i++) {
            position = data[i];
            device = Ext.getStore('Devices').findRecord('id', position.get('deviceId'), 0, false, false, true);

            if (device) {
                this.updateLatestMarker(position, device);
                this.updateLiveRoute(position);
            }
        }
    },

    updateLatestMarker: function (position, device) {
        var geometry, deviceId, marker, style;
        geometry = new ol.geom.Point(ol.proj.fromLonLat([
            position.get('longitude'),
            position.get('latitude')
        ]));
        deviceId = position.get('deviceId');
        if (deviceId in this.latestMarkers) {
            marker = this.latestMarkers[deviceId];
            style = marker.getStyle();
            if (style.getImage().angle !== position.get('course')) {
                Traccar.DeviceImages.rotateImageIcon(style.getImage(), position.get('course'));
            }
            marker.setGeometry(geometry);
        } else {
            marker = new ol.Feature(geometry);
            marker.set('record', device);

            style = this.getLatestMarker(this.getDeviceColor(device),
                    position.get('course'),
                    device.get('category'));
            style.getText().setText(device.get('name'));
            marker.setStyle(style);
            this.latestMarkers[deviceId] = marker;
            this.getView().getLatestSource().addFeature(marker);

        }

        if (marker === this.selectedMarker && this.lookupReference('deviceFollowButton').pressed) {
            this.getView().getMapView().setCenter(marker.getGeometry().getCoordinates());
        }
    },

    updateLiveRoute: function (position) {
        var deviceId, liveLine, liveCoordinates, lastLiveCoordinates, newCoordinates;
        deviceId = position.get('deviceId');
        if (deviceId in this.liveRoutes) {
            liveCoordinates = this.liveRoutes[deviceId].getGeometry().getCoordinates();
            lastLiveCoordinates = liveCoordinates[liveCoordinates.length - 1];
            newCoordinates = ol.proj.fromLonLat([position.get('longitude'), position.get('latitude')]);
            if (lastLiveCoordinates[0] === newCoordinates[0] &&
                    lastLiveCoordinates[1] === newCoordinates[1]) {
                return;
            }
            if (liveCoordinates.length >= this.liveRouteLength) {
                liveCoordinates.shift();
            }
            liveCoordinates.push(newCoordinates);
            this.liveRoutes[deviceId].getGeometry().setCoordinates(liveCoordinates);
        } else {
            liveLine = new ol.Feature({
                geometry: new ol.geom.LineString([
                    ol.proj.fromLonLat([
                        position.get('longitude'),
                        position.get('latitude')
                    ])
                ])
            });
            liveLine.setStyle(this.getRouteStyle(deviceId));
            this.liveRoutes[deviceId] = liveLine;
            this.getView().getLiveRouteSource().addFeature(liveLine);
        }
    },

    loadReport: function (store, data) {
        var i, position, point, geometry, marker, style;

        this.clearReport(store);

        if (data.length > 0) {
            this.reportRoute = [];
            for (i = 0; i < data.length; i++) {
                if (i === 0 || data[i].get('deviceId') !== data[i - 1].get('deviceId')) {
                    this.reportRoute.push(new ol.Feature({
                        geometry: new ol.geom.LineString([])
                    }));
                    this.reportRoute[this.reportRoute.length - 1].setStyle(this.getRouteStyle(data[i].get('deviceId')));
                    this.getView().getRouteSource().addFeature(this.reportRoute[this.reportRoute.length - 1]);
                }
                position = data[i];

                point = ol.proj.fromLonLat([
                    position.get('longitude'),
                    position.get('latitude')
                ]);
                geometry = new ol.geom.Point(point);

                marker = new ol.Feature(geometry);
                marker.set('record', position);
                this.reportMarkers[position.get('id')] = marker;
                this.getView().getReportSource().addFeature(marker);

                style = this.getReportMarker(position.get('deviceId'), position.get('course'));
                /*style.getText().setText(
                    Ext.Date.format(position.get('fixTime'), Traccar.Style.dateTimeFormat24));*/

                marker.setStyle(style);

                this.reportRoute[this.reportRoute.length - 1].getGeometry().appendCoordinate(point);
            }

            this.getView().getMapView().fit(this.reportRoute[0].getGeometry(), this.getView().getMap().getSize());
        }
    },

    clearReport: function (store) {
        var key, i;

        if (this.reportRoute) {
            for (i = 0; i < this.reportRoute.length; i++) {
                this.getView().getRouteSource().removeFeature(this.reportRoute[i]);
            }
            this.reportRoute = null;
        }

        if (this.reportMarkers) {
            for (key in this.reportMarkers) {
                if (this.reportMarkers.hasOwnProperty(key)) {
                    this.getView().getReportSource().removeFeature(this.reportMarkers[key]);
                }
            }
            this.reportMarkers = {};
        }
    },

    getRouteStyle: function (deviceId) {
        var index = 0;
        if (deviceId !== undefined) {
            index = deviceId % Traccar.Style.mapRouteColor.length;
        }
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: Traccar.Style.mapRouteColor[index],
                width: Traccar.Style.mapRouteWidth
            })
        });
    },

    getMarkerStyle: function (zoom, color, angle, category) {
        var image = Traccar.DeviceImages.getImageIcon(color, zoom, angle, category);
        return new ol.style.Style({
            image: image,
            text: new ol.style.Text({
                textBaseline: 'bottom',
                fill: new ol.style.Fill({
                    color: Traccar.Style.mapTextColor
                }),
                stroke: new ol.style.Stroke({
                    color: Traccar.Style.mapTextStrokeColor,
                    width: Traccar.Style.mapTextStrokeWidth
                }),
                offsetY: -image.getSize()[1] / 2 - Traccar.Style.mapTextOffset,
                font : Traccar.Style.mapTextFont
            })
        });
    },

    getLatestMarker: function (color, angle, category) {
        return this.getMarkerStyle(false, color, angle, category);
    },

    getReportMarker: function (deviceId, angle) {
        var index = 0;
        if (deviceId !== undefined) {
            index = deviceId % Traccar.Style.mapRouteColor.length;
        }
        return this.getMarkerStyle(false, Traccar.Style.mapRouteColor[index], angle, 'arrow');
    },

    resizeMarker: function (style, zoom) {
        var image, text;
        image = Traccar.DeviceImages.getImageIcon(style.getImage().fill,
                zoom,
                style.getImage().angle,
                style.getImage().category);
        text = style.getText();
        text.setOffsetY(-image.getSize()[1] / 2 - Traccar.Style.mapTextOffset);
        return new ol.style.Style({
            image: image,
            text: text
        });
    },

    selectMarker: function (marker, center) {
        if (this.selectedMarker) {
            this.selectedMarker.setStyle(
                this.resizeMarker(this.selectedMarker.getStyle(), false));
        }

        if (marker) {
            marker.setStyle(
                this.resizeMarker(marker.getStyle(), true));
            if (center) {
                this.getView().getMapView().setCenter(marker.getGeometry().getCoordinates());
            }
        }

        this.selectedMarker = marker;
    },

    selectDevice: function (device, center) {
        this.selectMarker(this.latestMarkers[device.get('id')], center);
    },

    selectReport: function (position, center) {
        if (position instanceof Traccar.model.Position) {
            this.selectMarker(this.reportMarkers[position.get('id')], center);
        }
    },

    selectFeature: function (feature) {
        var record = feature.get('record');
        if (record) {
            if (record instanceof Traccar.model.Device) {
                this.fireEvent('selectdevice', record, false);
            } else {
                this.fireEvent('selectreport', record, false);
            }
        }
    },

    getMapState: function () {
        var zoom, center, projection;
        projection = this.getView().getMapView().getProjection();
        center = ol.proj.transform(this.getView().getMapView().getCenter(), projection, 'EPSG:4326');
        zoom = this.getView().getMapView().getZoom();
        this.fireEvent('mapstate', center[1], center[0], zoom);
    },

    getGeofenceStyle: function (label) {
        return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: Traccar.Style.mapGeofenceOverlay
                }),
                stroke: new ol.style.Stroke({
                    color: Traccar.Style.mapGeofenceColor,
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

    showGeofences: function () {
        if (this.lookupReference('showGeofencesButton').pressed) {
            Ext.getStore('Geofences').each(function (geofence) {
                var feature = new ol.Feature(Traccar.GeofenceConverter
                        .wktToGeometry(this.getView().getMapView(), geofence.get('area')));
                feature.setStyle(this.getGeofenceStyle(geofence.get('name')));
                this.getView().getGeofencesSource().addFeature(feature);
                return true;
            }, this);
        } else {
            this.getView().getGeofencesSource().clear();
        }
    },

    updateGeofences: function () {
        if (this.lookupReference('showGeofencesButton').pressed) {
            this.getView().getGeofencesSource().clear();
            this.showGeofences();
        }
    }
});
