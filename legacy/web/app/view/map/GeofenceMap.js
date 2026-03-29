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

Ext.define('Traccar.view.map.GeofenceMap', {
    extend: 'Traccar.view.map.BaseMap',
    xtype: 'geofenceMapView',

    requires: [
        'Traccar.view.map.GeofenceMapController',
        'Traccar.GeofenceConverter'
    ],

    controller: 'geofenceMap',
    bodyBorder: true,

    tbar: {
        items: [{
            xtype: 'combobox',
            store: 'GeofenceTypes',
            valueField: 'key',
            displayField: 'name',
            editable: false,
            listeners: {
                select: 'onTypeSelect'
            }
        }, '-', {
            xtype: 'tbtext',
            html: Strings.sharedImport
        }, {
            xtype: 'filefield',
            name: 'file',
            buttonConfig: {
                glyph: 'xf093@FontAwesome',
                text: '',
                tooltip: Strings.sharedSelectFile,
                tooltipType: 'title'
            },
            listeners: {
                change: 'onFileChange',
                afterrender: function (fileField) {
                    fileField.fileInputEl.set({
                        accept: '.gpx'
                    });
                }
            }
        }, {
            xtype: 'tbfill'
        }, {
            glyph: 'xf00c@FontAwesome',
            tooltip: Strings.sharedSave,
            tooltipType: 'title',
            minWidth: 0,
            handler: 'onSaveClick'
        }, {
            glyph: 'xf00d@FontAwesome',
            tooltip: Strings.sharedCancel,
            tooltipType: 'title',
            minWidth: 0,
            handler: 'onCancelClick'
        }]
    },

    getFeatures: function () {
        return this.features;
    },

    initMap: function () {
        var map, mapView, featureOverlay, geometry, fillColor;
        this.callParent();

        map = this.map;
        mapView = this.mapView;

        this.features = new ol.Collection();
        if (this.area) {
            geometry = Traccar.GeofenceConverter.wktToGeometry(mapView, this.area);
            this.features.push(new ol.Feature(geometry));
            this.map.once('postrender', function () {
                mapView.fit(geometry, {
                    padding: [20, 20, 20, 20]
                });
            });
        } else {
            this.controller.fireEvent('mapstaterequest');
        }
        fillColor = ol.color.asArray(Traccar.Style.mapGeofenceColor);
        fillColor[3] = Traccar.Style.mapGeofenceOverlayOpacity;
        featureOverlay = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: this.features
            }),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: fillColor
                }),
                stroke: new ol.style.Stroke({
                    color: Traccar.Style.mapGeofenceColor,
                    width: Traccar.Style.mapGeofenceWidth
                }),
                image: new ol.style.Circle({
                    radius: Traccar.Style.mapGeofenceRadius,
                    fill: new ol.style.Fill({
                        color: Traccar.Style.mapGeofenceColor
                    })
                })
            })
        });
        featureOverlay.setMap(map);

        map.addInteraction(new ol.interaction.Modify({
            features: this.features,
            deleteCondition: function (event) {
                return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
            }
        }));
    },

    addInteraction: function (type) {
        var self = this;
        this.draw = new ol.interaction.Draw({
            features: this.features,
            type: type
        });
        this.draw.on('drawstart', function () {
            self.features.clear();
        });
        this.map.addInteraction(this.draw);
    },

    removeInteraction: function () {
        if (this.draw) {
            this.map.removeInteraction(this.draw);
            this.draw = null;
        }
    }
});
