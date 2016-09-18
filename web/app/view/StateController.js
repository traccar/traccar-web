/*
 * Copyright 2015 Anton Tananaev (anton.tananaev@gmail.com)
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

Ext.define('Traccar.view.StateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.state',

    requires: [
       'Traccar.AttributeFormatter',
       'Traccar.model.Attribute'
    ],

    config: {
        listen: {
            controller: {
                '*': {
                    selectDevice: 'selectDevice',
                    selectReport: 'selectReport'
                }
            },
            store: {
                '#LatestPositions': {
                    add: 'updateLatest',
                    update: 'updateLatest'
                },
                '#Positions': {
                    clear: 'clearReport'
                }
            }
        }
    },

    keys: (function () {
        var i, list, result;
        result = {};
        list = ['fixTime', 'latitude', 'longitude', 'valid', 'altitude', 'speed', 'course', 'address', 'protocol'];
        for (i = 0; i < list.length; i++) {
            result[list[i]] = {
                priority: i,
                name: Strings['position' + list[i].replace(/^\w/g, function (s) {
                    return s.toUpperCase();
                })]
            };
        }
        return result;
    }()),

    updateLatest: function (store, data) {
        var i;
        if (!Ext.isArray(data)) {
            data = [data];
        }
        for (i = 0; i < data.length; i++) {
            if (this.deviceId === data[i].get('deviceId')) {
                this.updatePosition(data[i]);
            }
        }
    },

    formatValue: function (value) {
        if (typeof (id) === 'number') {
            return Number(value.toFixed(2));
        } else {
            return value;
        }
    },

    updatePosition: function (position) {
        var attributes, store, key;
        store = Ext.getStore('Attributes');
        store.removeAll();

        for (key in position.data) {
            if (position.data.hasOwnProperty(key) && this.keys[key] !== undefined) {
                store.add(Ext.create('Traccar.model.Attribute', {
                    priority: this.keys[key].priority,
                    name: this.keys[key].name,
                    value: Traccar.AttributeFormatter.getFormatter(key)(position.get(key))
                }));
            }
        }

        attributes = position.get('attributes');
        if (attributes instanceof Object) {
            for (key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    store.add(Ext.create('Traccar.model.Attribute', {
                        priority: 1024,
                        name: key.replace(/^./, function (match) {
                            return match.toUpperCase();
                        }),
                        value: Traccar.AttributeFormatter.getFormatter(key)(attributes[key])
                    }));
                }
            }
        }
    },

    selectDevice: function (device) {
        var position;
        this.deviceId = device.get('id');
        position = Ext.getStore('LatestPositions').findRecord('deviceId', this.deviceId, 0, false, false, true);
        if (position) {
            this.updatePosition(position);
        } else {
            Ext.getStore('Attributes').removeAll();
        }
    },

    selectReport: function (position) {
        this.deviceId = null;
        this.updatePosition(position);
    },

    clearReport: function (store) {
        Ext.getStore('Attributes').removeAll();
    }
});
