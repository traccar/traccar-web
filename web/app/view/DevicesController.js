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

Ext.define('Traccar.view.DevicesController', {
    extend: 'Traccar.view.EditToolbarController',
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
                    selectdevice: 'selectDevice',
                    deselectfeature: 'deselectFeature'
                }
            },
            store: {
                '#Devices': {
                    update: 'onUpdateDevice'
                }
            }
        }
    },

    objectModel: 'Traccar.model.Device',
    objectDialog: 'Traccar.view.DeviceDialog',
    removeTitle: Strings.sharedDevice,

    init: function () {
        var readonly, deviceReadonly;
        deviceReadonly = Traccar.app.getUser().get('deviceReadonly');
        readonly = Traccar.app.getPreference('readonly', false) && !Traccar.app.getUser().get('admin');
        this.lookupReference('toolbarAddButton').setVisible(!readonly && !deviceReadonly);
        this.lookupReference('toolbarEditButton').setVisible(!readonly && !deviceReadonly);
        this.lookupReference('toolbarRemoveButton').setVisible(!readonly && !deviceReadonly);
        this.lookupReference('toolbarGeofencesButton').setVisible(!readonly);
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
        } else {
            this.fireEvent('deselectfeature');
        }
    },

    selectDevice: function (device, center) {
        this.getView().getSelectionModel().select([device], false, true);
        this.updateButtons(this.getView().getSelectionModel());
        this.getView().getView().focusRow(device);
    },

    selectReport: function (position) {
        if (position !== undefined) {
            this.deselectFeature();
        }
    },

    onUpdateDevice: function (store, data) {
        this.updateButtons(this.getView().getSelectionModel());
    },

    deselectFeature: function () {
        this.getView().getSelectionModel().deselectAll();
    }
});
