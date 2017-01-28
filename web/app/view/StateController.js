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

Ext.define('Traccar.view.StateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.state',

    requires: [
       'Traccar.AttributeFormatter',
       'Traccar.model.Attribute',
       'Traccar.model.AttributeAlias',
       'Traccar.model.Position',
       'Traccar.view.AttributeAliasDialog'

    ],

    config: {
        listen: {
            controller: {
                '*': {
                    selectdevice: 'selectDevice',
                    selectreport: 'selectReport',
                    updatealiases: 'updateAliases',
                    deselectfeature: 'deselectFeature'
                }
            },
            store: {
                '#LatestPositions': {
                    add: 'updateLatest',
                    update: 'updateLatest'
                },
                '#ReportRoute': {
                    clear: 'clearReport'
                },
                '#AttributeAliases': {
                    add: 'updateAliases',
                    update: 'updateAliases'
                }
            }
        }
    },

    init: function () {
        var visible = !Traccar.app.getUser().get('deviceReadonly') && !Traccar.app.getPreference('readonly', false);
        this.lookupReference('aliasEditButton').setVisible(visible);
        this.aliasesStore = Ext.getStore('AttributeAliases');
    },

    keys: (function () {
        var i, list, result;
        result = {};
        list = ['fixTime', 'latitude', 'longitude', 'valid', 'accuracy', 'altitude', 'speed', 'course', 'address', 'protocol'];
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

    findAttribute: function (record) {
        return record.get('deviceId') === this.position.get('deviceId') && record.get('attribute') === this.lookupAttribute;
    },

    updatePosition: function () {
        var attributes, store, key, aliasIndex, name;
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

        attributes = this.position.get('attributes');
        if (attributes instanceof Object) {
            for (key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    this.lookupAttribute = key;
                    aliasIndex = this.aliasesStore.findBy(this.findAttribute, this);
                    if (aliasIndex !== -1) {
                        name = this.aliasesStore.getAt(aliasIndex).get('alias');
                    } else {
                        name = key.replace(/^./, function (match) {
                            return match.toUpperCase();
                        });
                    }
                    store.add(Ext.create('Traccar.model.Attribute', {
                        priority: 1024,
                        name: name,
                        attribute: key,
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
        if (position instanceof Traccar.model.Position) {
            this.deviceId = null;
            this.position = position;
            this.updatePosition();
        }
    },

    deselectFeature: function () {
        this.deviceId = null;
        this.position = null;
        Ext.getStore('Attributes').removeAll();
    },

    clearReport: function (store) {
        this.position = null;
        Ext.getStore('Attributes').removeAll();
    },

    onSelectionChange: function (selected, records) {
        var enabled = selected.getCount() > 0 && records[0].get('priority') === 1024;
        this.lookupReference('aliasEditButton').setDisabled(!enabled);
    },

    onAliasEditClick: function () {
        var attribute, aliasIndex, attributeAlias, dialog;
        attribute = this.getView().getSelectionModel().getSelection()[0];
        this.lookupAttribute = attribute.get('attribute');
        aliasIndex = this.aliasesStore.findBy(this.findAttribute, this);
        if (aliasIndex !== -1) {
            attributeAlias = this.aliasesStore.getAt(aliasIndex);
        } else {
            attributeAlias = Ext.create('Traccar.model.AttributeAlias', {
                deviceId: this.position.get('deviceId'),
                attribute: attribute.get('attribute')
            });
            attributeAlias.store = this.aliasesStore;
        }
        dialog = Ext.create('Traccar.view.AttributeAliasDialog');
        dialog.down('form').loadRecord(attributeAlias);
        dialog.show();
    },

    updateAliases: function () {
        if (this.position) {
            this.updatePosition();
        }
    }
});
