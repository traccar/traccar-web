/*
 * Copyright 2016 Anton Tananaev (anton.tananaev@gmail.com)
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
    extend: 'Ext.form.Panel',
    xtype: 'baseMapView',

    layout: 'fit',

    getMap: function () {
        return this.map;
    },

    getMapView: function () {
        return this.mapView;
    },

    initMap: function () {
        var user, server, layer, type, bingKey, lat, lon, zoom, target;

        user = Traccar.app.getUser();
        server = Traccar.app.getServer();

        type = user.get('map') || server.get('map');
        bingKey = server.get('bingKey');

        if (type === 'custom') {
            layer = new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: server.get('mapUrl'),
                    attributions: [new ol.Attribution({
                        html: ''
                    })]
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
        } else {
            layer = new ol.layer.Tile({
                source: new ol.source.OSM({})
            });
        }

        lat = user.get('latitude') || server.get('latitude') || Traccar.Style.mapDefaultLat;
        lon = user.get('longitude') || server.get('longitude') || Traccar.Style.mapDefaultLon;
        zoom = user.get('zoom') || server.get('zoom') || Traccar.Style.mapDefaultZoom;

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
            this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                this.fireEvent('selectfeature', feature);
            }, this);
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
