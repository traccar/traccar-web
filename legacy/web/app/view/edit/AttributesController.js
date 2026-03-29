/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.edit.AttributesController', {
    extend: 'Traccar.view.edit.ToolbarController',
    alias: 'controller.attributes',

    requires: [
        'Traccar.view.dialog.Attribute',
        'Traccar.store.Attributes',
        'Traccar.model.Attribute'
    ],

    removeTitle: Strings.stateName,

    init: function () {
        var store, propertyName, i = 0, attributes;
        store = Ext.create('Traccar.store.Attributes');
        store.setProxy(Ext.create('Ext.data.proxy.Memory'));
        if (typeof this.getView().record.get('attributes') === 'undefined') {
            this.getView().record.set('attributes', {});
        }
        attributes = this.getView().record.get('attributes');
        for (propertyName in attributes) {
            if (attributes.hasOwnProperty(propertyName)) {
                store.add(Ext.create('Traccar.model.Attribute', {
                    priority: i++,
                    name: propertyName,
                    value: attributes[propertyName]
                }));
            }
        }
        store.addListener('add', function (store, records) {
            var i, view;
            view = this.getView();
            for (i = 0; i < records.length; i++) {
                view.record.get('attributes')[records[i].get('name')] = records[i].get('value');
            }
            view.record.dirty = true;
        }, this);
        store.addListener('update', function (store, record, operation) {
            var view;
            view = this.getView();
            if (operation === Ext.data.Model.EDIT) {
                if (record.modified.name !== record.get('name')) {
                    delete view.record.get('attributes')[record.modified.name];
                }
                view.record.get('attributes')[record.get('name')] = record.get('value');
                view.record.dirty = true;
            }
        }, this);
        store.addListener('remove', function (store, records) {
            var i, view;
            view = this.getView();
            for (i = 0; i < records.length; i++) {
                delete view.record.get('attributes')[records[i].get('name')];
            }
            view.record.dirty = true;
        }, this);

        this.getView().setStore(store);
        if (this.getView().record instanceof Traccar.model.Device) {
            this.getView().attributesStore = 'DeviceAttributes';
        } else if (this.getView().record instanceof Traccar.model.Geofence) {
            this.getView().attributesStore = 'GeofenceAttributes';
        } else if (this.getView().record instanceof Traccar.model.Group) {
            this.getView().attributesStore = 'GroupAttributes';
        } else if (this.getView().record instanceof Traccar.model.Server) {
            this.getView().attributesStore = 'ServerAttributes';
        } else if (this.getView().record instanceof Traccar.model.User) {
            this.getView().attributesStore = 'UserAttributes';
        }
    },

    comboConfig: {
        xtype: 'combobox',
        reference: 'nameComboField',
        name: 'name',
        fieldLabel: Strings.sharedName,
        displayField: 'name',
        valueField: 'key',
        allowBlank: false,
        queryMode: 'local',
        listeners: {
            change: 'onNameChange'
        }
    },

    initDialog: function (record) {
        var nameTextField, dialog = Ext.create('Traccar.view.dialog.Attribute');
        if (this.getView().attributesStore) {
            this.comboConfig.store = this.getView().attributesStore;
            nameTextField = dialog.lookupReference('nameTextField');
            dialog.down('form').insert(0, this.comboConfig);
            dialog.down('form').remove(nameTextField);
        }
        dialog.down('form').loadRecord(record);
        dialog.show();
    },

    onAddClick: function () {
        var objectInstance = Ext.create('Traccar.model.Attribute');
        objectInstance.store = this.getView().getStore();
        this.initDialog(objectInstance);
    },

    onEditClick: function () {
        this.initDialog(this.getView().getSelectionModel().getSelection()[0]);
    }
});
