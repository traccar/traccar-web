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

Ext.define('Traccar.view.BaseMap', {
    extend: 'Ext.panel.Panel',
    xtype: 'baseMapView',

    layout: 'fit',

    getMap: function () {
        return this.map;
    },

    getMapView: function () {
        return this.mapView;
    },

    initMap: function () {
        var server, layer, type, bingKey, lat, lon, zoom, target;

        server = Traccar.app.getServer();

        type = Traccar.app.getPreference('map', null);
        bingKey = server.get('bingKey');

        if (type === 'custom') {
            layer = new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: server.get('mapUrl'),
                    attributions: [
                        new ol.Attribution({
                            html: ''
                        })
                    ]
                })
            });
        } else if (type === 'bingRoad') {
            layer = new ol.layer.Tile({
                source: new ol.source.BingMaps({
                    key: bingKey,
                    imagerySet: 'Road'
                })
            });
        } else if (type === 'bingAerial') {
            layer = new ol.layer.Tile({
                source: new ol.source.BingMaps({
                    key: bingKey,
                    imagerySet: 'Aerial'
                })
            });
        } else if (type === 'osm') {
            layer = new ol.layer.Tile({
                source: new ol.source.OSM({})
            });
        } else {
            layer = new ol.layer.Tile({
                source: new ol.source.XYZ({
                    urls: [
                        'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
                        'https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
                        'https://cartodb-basemaps-c.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
                        'https://cartodb-basemaps-d.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
                    ],
                    attributions: [
                        new ol.Attribution({
                            html: [
                                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                                    'contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            ]
                        })
                    ]
                })
            });
        }

        lat = Traccar.app.getPreference('latitude', Traccar.Style.mapDefaultLat);
        lon = Traccar.app.getPreference('longitude', Traccar.Style.mapDefaultLon);
        zoom = Traccar.app.getPreference('zoom', Traccar.Style.mapDefaultZoom);

        this.mapView = new ol.View({
            center: ol.proj.fromLonLat([lon, lat]),
            zoom: zoom,
            maxZoom: Traccar.Style.mapMaxZoom
        });

        this.map = new ol.Map({
            target: this.body.dom.id,
            layers: [layer],
            view: this.mapView
        });

        target = this.map.getTarget();
        if (typeof target === 'string') {
            target = Ext.get(target).dom;
        }

        this.map.on('pointermove', function (e) {
            var hit = this.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                return true;
            });
            if (hit) {
                target.style.cursor = 'pointer';
            } else {
                target.style.cursor = '';
            }
        });

        this.map.on('click', function (e) {
            if (this.map.hasFeatureAtPixel(e.pixel, {
                layerFilter: function (layer) {
                    return !layer.get('name');
                }
            })) {
                this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                    this.fireEvent('selectfeature', feature);
                }.bind(this));
            } else {
                this.fireEvent('deselectfeature');
            }
        }, this);
    },

    listeners: {
        afterrender: function () {
            this.initMap();
        },

        resize: function () {
            this.map.updateSize();
        }
    }
});
