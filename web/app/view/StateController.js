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
       'Traccar.model.Attribute',
       'Traccar.model.AttributeAlias',
       'Traccar.view.AttributeAliasDialog'

    ],

    config: {
        listen: {
            controller: {
                '*': {
                    selectdevice: 'selectDevice',
                    selectreport: 'selectReport',
                    updatealiases: 'updateAliases'
                }
            },
            store: {
                '#LatestPositions': {
                    add: 'updateLatest',
                    update: 'updateLatest'
                },
                '#Positions': {
                    clear: 'clearReport'
                },
                '#AllAttributesAliases': {
                    add: 'updateAliases',
                    update: 'updateAliases'
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
                this.position = data[i];
                this.updatePosition();
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

    updatePosition: function () {
        var attributes, store, key, aliasesStore, attributeAlias, alias;
        store = Ext.getStore('Attributes');
        store.removeAll();

        for (key in this.position.data) {
            if (this.position.data.hasOwnProperty(key) && this.keys[key] !== undefined) {
                store.add(Ext.create('Traccar.model.Attribute', {
                    priority: this.keys[key].priority,
                    name: this.keys[key].name,
                    value: Traccar.AttributeFormatter.getFormatter(key)(this.position.get(key))
                }));
            }
        }

        aliasesStore = Ext.getStore('AllAttributesAliases');
        aliasesStore.filter('deviceId', this.position.get('deviceId'));

        attributes = this.position.get('attributes');
        if (attributes instanceof Object) {
            for (key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    attributeAlias = aliasesStore.findRecord('attribute', key, 0, false, true, true);
                    if (attributeAlias !== null) {
                        alias = attributeAlias.get('alias');
                    } else {
                        alias = '';
                    }
                    store.add(Ext.create('Traccar.model.Attribute', {
                        priority: 1024,
                        name: key.replace(/^./, function (match) {
                            return match.toUpperCase();
                        }),
                        attribute: key,
                        alias: alias,
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
            this.position = position;
            this.updatePosition();
        } else {
            this.position = null;
            Ext.getStore('Attributes').removeAll();
        }
    },

    selectReport: function (position) {
        this.deviceId = null;
        this.position = position;
        this.updatePosition();
    },

    clearReport: function (store) {
        this.position = null;
        Ext.getStore('Attributes').removeAll();
    },

    onSelectionChange: function (selected, records) {
        var enabled = selected.getCount() > 0 && records[0].get('attribute') !== '';
        this.lookupReference('aliasEditButton').setDisabled(!enabled);
    },

    onAliasEditClick: function () {
        var attribute, aliasesStore, attributeAlias, dialog;
        attribute = this.getView().getSelectionModel().getSelection()[0];
        aliasesStore = Ext.getStore('AllAttributesAliases');
        attributeAlias = aliasesStore.findRecord('attribute', attribute.get('attribute'), 0, false, true, true);
        if (attributeAlias === null) {
            attributeAlias = Ext.create('Traccar.model.AttributeAlias', {
                deviceId: this.position.get('deviceId'),
                attribute: attribute.get('attribute')
            });
            attributeAlias.store = aliasesStore;
        }
        dialog = Ext.create('Traccar.view.AttributeAliasDialog');
        dialog.down('form').loadRecord(attributeAlias);
        dialog.show();
    },

    updateAliases: function () {
        if (this.position !== null) {
            this.updatePosition();
        }
    }
});
