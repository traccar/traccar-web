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

Ext.define('Traccar.view.edit.DevicesController', {
    extend: 'Traccar.view.edit.ToolbarController',
    alias: 'controller.devices',

    requires: [
        'Traccar.view.dialog.Command',
        'Traccar.view.dialog.Device',
        'Traccar.view.permissions.DeviceGeofences',
        'Traccar.view.permissions.DeviceAttributes',
        'Traccar.view.permissions.DeviceDrivers',
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
    objectDialog: 'Traccar.view.dialog.Device',
    removeTitle: Strings.sharedDevice,

    init: function () {
        var self = this, readonly, deviceReadonly;
        deviceReadonly = Traccar.app.getPreference('deviceReadonly', false) && !Traccar.app.getUser().get('admin');
        readonly = Traccar.app.getPreference('readonly', false) && !Traccar.app.getUser().get('admin');
        this.lookupReference('toolbarAddButton').setDisabled(readonly || deviceReadonly);

        setInterval(function () {
            self.getView().getView().refresh();
        }, Traccar.Style.refreshPeriod);
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
                baseObject: device.getId()
            }
        }).show();
    },

    onAttributesClick: function () {
        var device = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedComputedAttributes,
            items: {
                xtype: 'deviceAttributesView',
                baseObjectName: 'deviceId',
                linkObjectName: 'attributeId',
                storeName: 'ComputedAttributes',
                baseObject: device.getId()
            }
        }).show();
    },

    onDriversClick: function () {
        var device = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedDrivers,
            items: {
                xtype: 'deviceDriversView',
                baseObjectName: 'deviceId',
                linkObjectName: 'driverId',
                storeName: 'Drivers',
                baseObject: device.getId()
            }
        }).show();
    },

    onCommandClick: function () {
        var device, deviceId, command, dialog, typesStore, online;
        device = this.getView().getSelectionModel().getSelection()[0];
        online = device.get('status') === 'online';
        deviceId = device.get('id');

        command = Ext.create('Traccar.model.Command');
        command.set('deviceId', deviceId);
        command.set('textChannel', !online);

        dialog = Ext.create('Traccar.view.dialog.Command');

        typesStore = dialog.lookupReference('commandType').getStore();
        typesStore.getProxy().setExtraParam('deviceId', deviceId);

        dialog.down('form').loadRecord(command);
        dialog.lookupReference('textChannelCheckBox').setDisabled(!online);
        dialog.show();
    },

    updateButtons: function (selected) {
        var readonly, deviceReadonly, empty;
        deviceReadonly = Traccar.app.getPreference('deviceReadonly', false) && !Traccar.app.getUser().get('admin');
        readonly = Traccar.app.getPreference('readonly', false) && !Traccar.app.getUser().get('admin');
        empty = selected.length === 0;
        this.lookupReference('toolbarEditButton').setDisabled(empty || readonly || deviceReadonly);
        this.lookupReference('toolbarRemoveButton').setDisabled(empty || readonly || deviceReadonly);
        this.lookupReference('toolbarGeofencesButton').setDisabled(empty || readonly);
        this.lookupReference('toolbarAttributesButton').setDisabled(empty || readonly);
        this.lookupReference('toolbarDriversButton').setDisabled(empty || readonly);
        this.lookupReference('deviceCommandButton').setDisabled(empty || readonly);
    },

    onSelectionChange: function (selection, selected) {
        this.updateButtons(selected);
        if (selected.length > 0) {
            this.fireEvent('selectdevice', selected[0], true);
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
