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

Ext.define('Traccar.view.map.Map', {
    extend: 'Traccar.view.map.BaseMap',
    xtype: 'mapView',

    requires: [
        'Traccar.view.map.MapController',
        'Traccar.view.SettingsMenu'
    ],

    controller: 'map',

    title: '',
    tbar: {
        componentCls: 'toolbar-header-style',
        defaults: {
            xtype: 'buttongroup',
            tooltipType: 'title',
            stateEvents: ['toggle'],
            enableToggle: true,
            stateful: {
                pressed: true
            }
        },
        items: [{
            xtype: 'tbtext',
            html: '',
            baseCls: 'x-panel-header-title-default'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            reference: 'deviceFollowButton',
            glyph: 'xf05b@FontAwesome',
            tooltip: Strings.deviceFollow,
            stateId: 'device-follow-button',
            toggleHandler: 'onFollowClick'
        }, {
            xtype: 'button',
            handler: 'showCurrentLocation',
            glyph: 'xf124@FontAwesome',
            tooltip: Strings.mapCurrentLocation
        }, {
            xtype: 'settingsMenu',
            glyph: 'xf046@FontAwesome',
            scale: 'small',
            rowspan: 1,
            iconCls: 'add',
            iconAlign: 'top',
            arrowAlign: 'right',
            menu: [{
                handler: 'showReports',
                reference: 'showReportsButton',
                glyph: 'xf0f6@FontAwesome',
                text: Strings.reportTitle,
                stateful: false,
                enableToggle: false,
                tooltip: Strings.reportTitle
            }, {
                handler: 'showEvents',
                reference: 'showEventsButton',
                glyph: 'xf27b@FontAwesome',
                text: Strings.reportEvents,
                stateful: false,
                enableToggle: false,
                tooltip: Strings.reportEvents
            }, {
                handler: 'updateGeofences',
                reference: 'showGeofencesButton',
                glyph: 'xf21d@FontAwesome',
                text: Strings.sharedGeofences,
                checked: true,
                stateId: 'show-geofences-button',
                tooltip: Strings.sharedGeofences
            }, {
                handler: 'showAccuracy',
                reference: 'showAccuracyButton',
                glyph: 'xf140@FontAwesome',
                text: Strings.positionAccuracy,
                checked: true,
                stateId: 'show-accuracy-button',
                tooltip: Strings.positionAccuracy
            }, {
                handler: 'showLiveRoutes',
                reference: 'showLiveRoutes',
                glyph: 'xf1b0@FontAwesome',
                checked: true,
                text: Strings.mapLiveRoutes,
                stateId: 'show-live-routes-button',
                tooltip: Strings.mapLiveRoutes
            }, {
                glyph: 'xf0d0@FontAwesome',
                text: 'foxgps 2.0',
                handler: function () {
                    location.assign(window.location.href + 'modern');
                }
            }]
        }, {
            xtype: 'settingsMenu',
            enableToggle: false
        }]
    },

    getMarkersSource: function () {
        return this.markersSource;
    },

    getAccuracySource: function () {
        return this.accuracySource;
    },

    getAccuracyLayer: function () {
        return this.accuracyLayer;
    },

    getRouteSource: function () {
        return this.routeSource;
    },

    getGeofencesSource: function () {
        return this.geofencesSource;
    },

    getLiveRouteSource: function () {
        return this.liveRouteSource;
    },

    getLiveRouteLayer: function () {
        return this.liveRouteLayer;
    },

    initMap: function () {
        this.callParent();

        this.geofencesSource = new ol.source.Vector({});
        this.map.addLayer(new ol.layer.Vector({
            name: 'geofencesLayer',
            source: this.geofencesSource
        }));

        this.liveRouteSource = new ol.source.Vector({});
        this.liveRouteLayer = new ol.layer.Vector({
            source: this.liveRouteSource,
            visible: this.lookupReference('showLiveRoutes').checked
        });
        this.map.addLayer(this.liveRouteLayer);

        this.routeSource = new ol.source.Vector({});
        this.map.addLayer(new ol.layer.Vector({
            source: this.routeSource
        }));

        this.accuracySource = new ol.source.Vector({});
        this.accuracyLayer = new ol.layer.Vector({
            name: 'accuracyLayer',
            source: this.accuracySource
        });
        this.map.addLayer(this.accuracyLayer);

        this.markersSource = new ol.source.Vector({});
        this.map.addLayer(new ol.layer.Vector({
            source: this.markersSource
        }));
    }
});
