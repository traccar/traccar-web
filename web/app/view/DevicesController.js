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

Ext.define('Traccar.view.DevicesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.devices',

    requires: [
        'Traccar.view.CommandDialog',
        'Traccar.view.DeviceDialog',
        'Traccar.view.DeviceGeofences',
        'Traccar.view.BaseWindow',
        'Traccar.model.Device',
        'Traccar.model.Command'
    ],

    config: {
        listen: {
            controller: {
                '*': {
                    selectdevice: 'selectDevice',
                    selectreport: 'selectReport'
                }
            },
            store: {
                '#Groups': {
                    datachanged: 'storeUpdate',
                    update: 'storeUpdate'
                },
                '#Devices': {
                    datachanged: 'storeUpdate',
                    update: 'onUpdateDevice'
                }
            }
        }
    },

    storeUpdate: function () {
        var groupsStore, devicesStore, nodes = [];
        groupsStore = Ext.getStore('Groups');
        devicesStore = Ext.getStore('Devices');

        groupsStore.each(function (record) {
            var groupId, node = {
                id: 'g' + record.get('id'),
                original: record,
                name: record.get('name'),
                leaf: true
            };
            groupId = record.get('groupId');
            if (groupId !== 0 && groupsStore.indexOfId(groupId) !== -1) {
                node.groupId = 'g' + groupId;
            }
            nodes.push(node);
        }, this);
        devicesStore.each(function (record) {
            var groupId, node = {
                id: 'd' + record.get('id'),
                original: record,
                name: record.get('name'),
                status: record.get('status'),
                lastUpdate: record.get('lastUpdate'),
                leaf: true
            };
            groupId = record.get('groupId');
            if (groupId !== 0 && groupsStore.indexOfId(groupId) !== -1) {
                node.groupId = 'g' + groupId;
            }
            nodes.push(node);
        }, this);

        this.getView().getStore().getProxy().setData(nodes);
        this.getView().getStore().load();
        this.getView().expandAll();
    },

    init: function () {
        var readonly = Traccar.app.getServer().get('readonly') && !Traccar.app.getUser().get('admin');
        this.lookupReference('toolbarAddButton').setVisible(!readonly);
        this.lookupReference('toolbarEditButton').setVisible(!readonly);
        this.lookupReference('toolbarRemoveButton').setVisible(!readonly);
        this.lookupReference('toolbarGeofencesButton').setVisible(!readonly);
    },

    onAddClick: function () {
        var device, dialog;
        device = Ext.create('Traccar.model.Device');
        device.store = Ext.getStore('Devices');
        dialog = Ext.create('Traccar.view.DeviceDialog');
        dialog.down('form').loadRecord(device);
        dialog.show();
    },

    onEditClick: function () {
        var device, dialog, store = Ext.getStore('Devices');;
        device = this.getView().getSelectionModel().getSelection()[0];
        dialog = Ext.create('Traccar.view.DeviceDialog');
        dialog.down('form').loadRecord(store.getById(device.getId().substr(1)));
        dialog.show();
    },

    onRemoveClick: function () {
        var device = this.getView().getSelectionModel().getSelection()[0];
        Ext.Msg.show({
            title: Strings.deviceDialog,
            message: Strings.sharedRemoveConfirm,
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: Strings.sharedRemove,
                no: Strings.sharedCancel
            },
            fn: function (btn) {
                var store;
                if (btn === 'yes') {
                    store = Ext.getStore('Devices');
                    store.remove(store.getById(device.getId().substr(1)));
                    store.sync();
                }
            }
        });
    },

    onGeofencesClick: function () {
        var device = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedGeofences,
            items: {
                xtype: 'deviceGeofencesView',
                baseObjectName: 'deviceId',
                linkObjectName: 'geofenceId',
                storeName: 'Geofences',
                urlApi: 'api/devices/geofences',
                baseObject: device.getId()
            }
        }).show();
    },

    onCommandClick: function () {
        var device, deviceId, command, dialog, comboStore;
        device = this.getView().getSelectionModel().getSelection()[0];
        deviceId = device.get('id');
        command = Ext.create('Traccar.model.Command');
        command.set('deviceId', deviceId);
        dialog = Ext.create('Traccar.view.CommandDialog');
        comboStore = dialog.down('form').down('combobox').getStore();
        comboStore.getProxy().setExtraParam('deviceId', deviceId);
        dialog.down('form').loadRecord(command);
        dialog.show();
    },

    onFollowClick: function (button, pressed) {
        var device, store = Ext.getStore('Devices');
        if (pressed) {
            device = this.getView().getSelectionModel().getSelection()[0];
            this.fireEvent('selectdevice', store.getById(device.getId().substr(1)), true);
        }
    },

    updateButtons: function (selected) {
        var empty = selected.getCount() === 0;
        this.lookupReference('toolbarEditButton').setDisabled(empty);
        this.lookupReference('toolbarRemoveButton').setDisabled(empty);
        this.lookupReference('toolbarGeofencesButton').setDisabled(empty);
        this.lookupReference('deviceCommandButton').setDisabled(empty || (selected.getLastSelected().get('status') !== 'online'));
    },

    onSelectionChange: function (selected) {
        var device, store = Ext.getStore('Devices');
        this.updateButtons(selected);
        if (selected.getCount() > 0) {
            device = selected.getLastSelected();
            this.fireEvent('selectDevice', store.getById(device.getId().substr(1)), true);
        }
    },

    onBeforeSelect: function (row, record) {
        return record.get('original') instanceof Traccar.model.Device;
    },

    selectDevice: function (device, center) {
        var store = this.getView().getStore();
        this.getView().getSelectionModel().select([store.getById('d' + device.getId())], false, true);
    },

    selectReport: function (position) {
        if (position !== undefined) {
            this.getView().getSelectionModel().deselectAll();
        }
    },

    onUpdateDevice: function (store, data) {
        this.storeUpdate();
        this.updateButtons(this.getView().getSelectionModel());
    }
});
