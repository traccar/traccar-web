/*
 * Copyright 2016 - 2021 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.map.BaseMap', {
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
        var server, layer, type, bingKey, locationIqKey, lat, lon, zoom, maxZoom, target, poiLayer, self = this;

        server = Traccar.app.getServer();

        type = Traccar.app.getPreference('map', null);
        bingKey = server.get('bingKey');
        locationIqKey = Traccar.app.getAttributePreference('locationIqKey', 'pk.0f147952a41c555a5b70614039fd148b');

        layer = new ol.layer.Group({
            title: Strings.mapLayer,
            layers: [
                new ol.layer.Tile({
                    title: Strings.mapCustom,
                    type: 'base',
                    visible: type === 'custom',
                    source: new ol.source.XYZ({
                        url: Ext.String.htmlDecode(server.get('mapUrl')),
                        attributions: ''
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapCustomArcgis,
                    type: 'base',
                    visible: type === 'customArcgis',
                    source: new ol.source.TileArcGISRest({
                        url: Ext.String.htmlDecode(server.get('mapUrl'))
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapBingRoad,
                    type: 'base',
                    visible: type === 'bingRoad',
                    source: new ol.source.BingMaps({
                        key: bingKey,
                        imagerySet: 'Road'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapBingAerial,
                    type: 'base',
                    visible: type === 'bingAerial',
                    source: new ol.source.BingMaps({
                        key: bingKey,
                        imagerySet: 'Aerial'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapBingHybrid,
                    type: 'base',
                    visible: type === 'bingHybrid',
                    source: new ol.source.BingMaps({
                        key: bingKey,
                        imagerySet: 'AerialWithLabels'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapCarto,
                    type: 'base',
                    visible: type === 'carto',
                    source: new ol.source.XYZ({
                        url: 'https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
                        attributions: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                            'contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapAutoNavi,
                    type: 'base',
                    visible: type === 'autoNavi' || type === 'baidu',
                    source: new ol.source.OSM({
                        url: 'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapYandexMap,
                    type: 'base',
                    visible: type === 'yandexMap',
                    source: new ol.source.XYZ({
                        url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}',
                        projection: 'EPSG:3395',
                        attributions: '&copy; <a href="https://yandex.com/maps/">Yandex</a>'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapYandexSat,
                    type: 'base',
                    visible: type === 'yandexSat',
                    source: new ol.source.XYZ({
                        url: 'https://core-sat.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
                        projection: 'EPSG:3395',
                        attributions: '&copy; <a href="https://yandex.com/maps/">Yandex</a>'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapOsm,
                    type: 'base',
                    visible: type === 'osm',
                    source: new ol.source.OSM({})
                }),
                new ol.layer.Tile({
                    title: Strings.mapLocationIqStreets,
                    type: 'base',
                    visible: type === 'locationIqStreets' || type === 'wikimedia' || !type,
                    source: new ol.source.XYZ({
                        url: 'https://{a-c}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=' + locationIqKey,
                        attributions: '&copy; <a href="https://locationiq.com/">LocationIQ</a>'
                    })
                })
            ]
        });

        lat = Traccar.app.getPreference('latitude', Traccar.Style.mapDefaultLat);
        lon = Traccar.app.getPreference('longitude', Traccar.Style.mapDefaultLon);
        zoom = Traccar.app.getPreference('zoom', Traccar.Style.mapDefaultZoom);
        maxZoom = Traccar.app.getAttributePreference('web.maxZoom', Traccar.Style.mapMaxZoom);

        this.mapView = new ol.View({
            center: ol.proj.fromLonLat([lon, lat]),
            zoom: zoom,
            maxZoom: maxZoom
        });

        this.map = new ol.Map({
            target: this.body.dom.id,
            layers: [layer],
            view: this.mapView
        });

        poiLayer = Traccar.app.getPreference('poiLayer', null);

        if (poiLayer) {
            this.map.addLayer(new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: poiLayer,
                    format: new ol.format.KML()
                })
            }));
        }

        switch (Traccar.app.getAttributePreference('distanceUnit', 'km')) {
            case 'mi':
                this.map.addControl(new ol.control.ScaleLine({
                    units: 'us'
                }));
                break;
            case 'nmi':
                this.map.addControl(new ol.control.ScaleLine({
                    units: 'nautical'
                }));
                break;
            default:
                this.map.addControl(new ol.control.ScaleLine());
                break;
        }

        this.map.addControl(new ol.control.LayerSwitcher());

        target = this.map.getTarget();
        if (typeof target === 'string') {
            target = Ext.get(target).dom;
        }

        this.map.on('pointermove', function (e) {
            var hit = this.forEachFeatureAtPixel(e.pixel, function () {
                return true;
            });
            if (hit) {
                target.style.cursor = 'pointer';
            } else {
                target.style.cursor = '';
            }
        });

        this.map.on('click', function (e) {
            var i, features = self.map.getFeaturesAtPixel(e.pixel, {
                layerFilter: function (layer) {
                    return !layer.get('name');
                }
            });
            if (features) {
                for (i = 0; i < features.length; i++) {
                    self.fireEvent('selectfeature', features[i]);
                }
            } else {
                self.fireEvent('deselectfeature');
            }
        });

        this.map.once('postrender', function () {
            self.fireEvent('mapready');
        });
    },

    listeners: {
        afterrender: function () {
            this.initMap();
        },

        resize: function () {
            this.map.updateSize();
        }
    }
}, function () {
    var projection;
    proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
    ol.proj.proj4.register(proj4);
    projection = ol.proj.get('EPSG:3395');
    if (projection) {
        projection.setExtent([-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244]);
    }
});
