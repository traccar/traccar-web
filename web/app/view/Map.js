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

Ext.define('Traccar.view.Map', {
    extend: 'Traccar.view.BaseMap',
    xtype: 'mapView',

    requires: [
        'Traccar.view.MapController',
        'Traccar.view.SettingsMenu'
    ],

    controller: 'map',

    title: Strings.mapTitle,
    tbar: {
        componentCls: 'toolbar-header-style',
        items: [{
            xtype: 'tbtext',
            html: Strings.mapTitle,
            baseCls: 'x-panel-header-title-default'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            tooltipType: 'title',
            handler: 'showReports',
            reference: 'showReportsButton',
            glyph: 'xf0f6@FontAwesome',
            tooltip: Strings.reportTitle
        }, {
            xtype: 'button',
            tooltipType: 'title',
            handler: 'updateGeofences',
            reference: 'showGeofencesButton',
            glyph: 'xf21d@FontAwesome',
            enableToggle: true,
            tooltip: Strings.sharedGeofences
        }, {
            xtype: 'button',
            tooltipType: 'title',
            handler: 'showLiveRoutes',
            reference: 'showLiveRoutes',
            glyph: 'xf1b0@FontAwesome',
            enableToggle: true,
            tooltip: Strings.mapLiveRoutes
        }, {
            reference: 'deviceFollowButton',
            glyph: 'xf05b@FontAwesome',
            tooltip: Strings.deviceFollow,
            tooltipType: 'title',
            enableToggle: true,
            toggleHandler: 'onFollowClick'
        }, {
            id: 'muteButton',
            glyph: 'xf1f7@FontAwesome',
            tooltip: Strings.sharedMute,
            tooltipType: 'title',
            enableToggle: true,
            listeners: {
                toggle: function (button, pressed) {
                    if (pressed) {
                        button.setGlyph('xf1f7@FontAwesome');
                    } else {
                        button.setGlyph('xf0a2@FontAwesome');
                    }
                },
                scope: this
            }
        }, {
            xtype: 'settingsMenu'
        }]
    },

    getMarkersSource: function () {
        return this.markersSource;
    },

    getAccuracySource: function () {
        return this.accuracySource;
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
            visible: false
        });
        this.map.addLayer(this.liveRouteLayer);

        this.routeSource = new ol.source.Vector({});
        this.map.addLayer(new ol.layer.Vector({
            source: this.routeSource
        }));

        this.accuracySource = new ol.source.Vector({});
        this.map.addLayer(new ol.layer.Vector({
            name: 'accuracyLayer',
            source: this.accuracySource
        }));

        this.markersSource = new ol.source.Vector({});
        this.map.addLayer(new ol.layer.Vector({
            source: this.markersSource
        }));
    }
});
