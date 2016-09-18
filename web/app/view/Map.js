/*
 * Copyright 2015 - 2016 Anton Tananaev (anton.tananaev@gmail.com)
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
        'Traccar.view.MapController'
    ],

    controller: 'map',

    title: Strings.mapTitle,

    getLatestSource: function () {
        return this.latestSource;
    },

    getRouteSource: function () {
        return this.routeSource;
    },

    getReportSource: function () {
        return this.reportSource;
    },

    initMap: function () {
        this.callParent();

        this.latestSource = new ol.source.Vector({});
        this.map.addLayer(new ol.layer.Vector({
            source: this.latestSource
        }));

        this.routeSource = new ol.source.Vector({});
        this.map.addLayer(new ol.layer.Vector({
            source: this.routeSource
        }));

        this.reportSource = new ol.source.Vector({});
        this.map.addLayer(new ol.layer.Vector({
            source: this.reportSource
        }));
    }
});
