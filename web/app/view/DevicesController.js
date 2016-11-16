/*
 * Copyright 2015 - 2016 Anton Tananaev (anton@traccar.org)
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
                    selectreport: 'selectReport'
                },
                'map': {
                    selectdevice: 'selectDevice'
                }
            },
            store: {
                '#Devices': {
                    update: 'onUpdateDevice'
                }
            }
        }
    },

    init: function () {
        var readonly = Traccar.app.getPreference('readonly', false) && !Traccar.app.getUser().get('admin');
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
        var device, dialog;
        device = this.getView().getSelectionModel().getSelection()[0];
        dialog = Ext.create('Traccar.view.DeviceDialog');
        dialog.down('form').loadRecord(device);
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
                    store.remove(device);
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

    updateButtons: function (selected) {
        var empty = selected.getCount() === 0;
        this.lookupReference('toolbarEditButton').setDisabled(empty);
        this.lookupReference('toolbarRemoveButton').setDisabled(empty);
        this.lookupReference('toolbarGeofencesButton').setDisabled(empty);
        this.lookupReference('deviceCommandButton').setDisabled(empty || (selected.getLastSelected().get('status') !== 'online'));
    },

    onSelectionChange: function (selected) {
        this.updateButtons(selected);
        if (selected.getCount() > 0) {
            this.fireEvent('selectdevice', selected.getLastSelected(), true);
        }
    },

    selectDevice: function (device, center) {
        this.getView().getSelectionModel().select([device], false, true);
        this.updateButtons(this.getView().getSelectionModel());
        this.getView().getView().focusRow(device);
    },

    selectReport: function (position) {
        if (position !== undefined) {
            this.getView().getSelectionModel().deselectAll();
        }
    },

    onUpdateDevice: function (store, data) {
        this.updateButtons(this.getView().getSelectionModel());
    }
});
