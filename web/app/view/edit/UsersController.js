/*
 * Copyright 2015 - 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2016 - 2017 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.view.edit.UsersController', {
    extend: 'Traccar.view.edit.ToolbarController',
    alias: 'controller.users',

    requires: [
        'Traccar.view.dialog.User',
        'Traccar.view.permissions.Devices',
        'Traccar.view.permissions.Groups',
        'Traccar.view.permissions.Geofences',
        'Traccar.view.permissions.Calendars',
        'Traccar.view.permissions.Users',
        'Traccar.view.permissions.ComputedAttributes',
        'Traccar.view.permissions.Drivers',
        'Traccar.view.permissions.SavedCommands',
        'Traccar.view.permissions.Notifications',
        'Traccar.view.permissions.Maintenances',
        'Traccar.view.BaseWindow',
        'Traccar.model.User'
    ],

    objectModel: 'Traccar.model.User',
    objectDialog: 'Traccar.view.dialog.User',
    removeTitle: Strings.settingsUser,

    init: function () {
        Ext.getStore('Users').load();
        this.lookupReference('userUsersButton').setHidden(!Traccar.app.getUser().get('administrator'));
        this.lookupReference('userDriversButton').setHidden(
            Traccar.app.getVehicleFeaturesDisabled() || Traccar.app.getBooleanAttributePreference('ui.disableDrivers'));
        this.lookupReference('userAttributesButton').setHidden(
            Traccar.app.getBooleanAttributePreference('ui.disableComputedAttributes'));
        this.lookupReference('userCalendarsButton').setHidden(
            Traccar.app.getBooleanAttributePreference('ui.disableCalendars'));
        this.lookupReference('userCommandsButton').setHidden(Traccar.app.getPreference('limitCommands', false));
        this.lookupReference('userMaintenancesButton').setHidden(
            Traccar.app.getVehicleFeaturesDisabled() || Traccar.app.getBooleanAttributePreference('ui.disableMaintenance'));
    },

    onEditClick: function () {
        var dialog, user = this.getView().getSelectionModel().getSelection()[0];
        dialog = Ext.create('Traccar.view.dialog.User', {
            selfEdit: user.get('id') === Traccar.app.getUser().get('id')
        });
        dialog.down('form').loadRecord(user);
        dialog.show();
    },

    onAddClick: function () {
        var user, dialog;
        user = Ext.create('Traccar.model.User');
        if (Traccar.app.getUser().get('administrator')) {
            user.set('deviceLimit', -1);
        }
        if (Traccar.app.getUser().get('expirationTime')) {
            user.set('expirationTime', Traccar.app.getUser().get('expirationTime'));
        }
        dialog = Ext.create('Traccar.view.dialog.User');
        dialog.down('form').loadRecord(user);
        dialog.show();
    },

    onDevicesClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.getStore('AllGroups').load();
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.deviceTitle,
            items: {
                xtype: 'linkDevicesView',
                baseObjectName: 'userId',
                linkObjectName: 'deviceId',
                storeName: 'AllDevices',
                linkStoreName: 'Devices',
                baseObject: user.getId()
            }
        }).show();
    },

    onGroupsClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.settingsGroups,
            items: {
                xtype: 'linkGroupsView',
                baseObjectName: 'userId',
                linkObjectName: 'groupId',
                storeName: 'AllGroups',
                linkStoreName: 'Groups',
                baseObject: user.getId()
            }
        }).show();
    },

    onGeofencesClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedGeofences,
            items: {
                xtype: 'linkGeofencesView',
                baseObjectName: 'userId',
                linkObjectName: 'geofenceId',
                storeName: 'AllGeofences',
                linkStoreName: 'Geofences',
                baseObject: user.getId()
            }
        }).show();
    },

    onNotificationsClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedNotifications,
            items: {
                xtype: 'linkNotificationsView',
                baseObjectName: 'userId',
                linkObjectName: 'notificationId',
                storeName: 'AllNotifications',
                linkStoreName: 'Notifications',
                baseObject: user.getId()
            }
        }).show();
    },

    onCalendarsClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedCalendars,
            items: {
                xtype: 'linkCalendarsView',
                baseObjectName: 'userId',
                linkObjectName: 'calendarId',
                storeName: 'AllCalendars',
                linkStoreName: 'Calendars',
                baseObject: user.getId()
            }
        }).show();
    },

    onUsersClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.settingsUsers,
            items: {
                xtype: 'linkUsersView',
                baseObjectName: 'userId',
                linkObjectName: 'managedUserId',
                storeName: 'Users',
                baseObject: user.getId()
            }
        }).show();
    },

    onAttributesClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedComputedAttributes,
            items: {
                xtype: 'linkComputedAttributesView',
                baseObjectName: 'userId',
                linkObjectName: 'attributeId',
                storeName: 'AllComputedAttributes',
                linkStoreName: 'ComputedAttributes',
                baseObject: user.getId()
            }
        }).show();
    },

    onDriversClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedDrivers,
            items: {
                xtype: 'linkDriversView',
                baseObjectName: 'userId',
                linkObjectName: 'driverId',
                storeName: 'AllDrivers',
                linkStoreName: 'Drivers',
                baseObject: user.getId()
            }
        }).show();
    },

    onCommandsClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedSavedCommands,
            items: {
                xtype: 'linkSavedCommandsView',
                baseObjectName: 'userId',
                linkObjectName: 'commandId',
                storeName: 'AllCommands',
                linkStoreName: 'Commands',
                baseObject: user.getId()
            }
        }).show();
    },

    onMaintenancesClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedMaintenance,
            items: {
                xtype: 'linkMaintenancesView',
                baseObjectName: 'userId',
                linkObjectName: 'maintenanceId',
                storeName: 'AllMaintenances',
                linkStoreName: 'Maintenances',
                baseObject: user.getId()
            }
        }).show();
    },

    onSelectionChange: function (selection, selected) {
        var disabled = selected.length === 0;
        this.lookupReference('userDevicesButton').setDisabled(disabled);
        this.lookupReference('userGroupsButton').setDisabled(disabled);
        this.lookupReference('userGeofencesButton').setDisabled(disabled);
        this.lookupReference('userNotificationsButton').setDisabled(disabled);
        this.lookupReference('userCalendarsButton').setDisabled(disabled);
        this.lookupReference('userAttributesButton').setDisabled(disabled);
        this.lookupReference('userDriversButton').setDisabled(disabled);
        this.lookupReference('userCommandsButton').setDisabled(disabled);
        this.lookupReference('userMaintenancesButton').setDisabled(disabled);
        this.lookupReference('userUsersButton').setDisabled(disabled || selected[0].get('userLimit') === 0);
        this.callParent(arguments);
    }
});
