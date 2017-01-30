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

Ext.define('Traccar.view.UsersController', {
    extend: 'Traccar.view.EditToolbarController',
    alias: 'controller.users',

    requires: [
        'Traccar.view.UserDialog',
        'Traccar.view.UserDevices',
        'Traccar.view.UserGroups',
        'Traccar.view.UserGeofences',
        'Traccar.view.UserCalendars',
        'Traccar.view.UserUsers',
        'Traccar.view.Notifications',
        'Traccar.view.BaseWindow',
        'Traccar.model.User'
    ],

    objectModel: 'Traccar.model.User',
    objectDialog: 'Traccar.view.UserDialog',
    removeTitle: Strings.settingsUser,

    init: function () {
        Ext.getStore('Users').load();
        this.lookupReference('userUsersButton').setHidden(!Traccar.app.getUser().get('admin'));
    },

    onAddClick: function () {
        var user, dialog;
        user = Ext.create('Traccar.model.User');
        if (Traccar.app.getUser().get('admin')) {
            user.set('deviceLimit', -1);
        }
        if (Traccar.app.getUser().get('expirationTime')) {
            user.set('expirationTime', Traccar.app.getUser().get('expirationTime'));
        }
        dialog = Ext.create('Traccar.view.UserDialog');
        dialog.down('form').loadRecord(user);
        dialog.show();
    },

    onDevicesClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.deviceTitle,
            items: {
                xtype: 'userDevicesView',
                baseObjectName: 'userId',
                linkObjectName: 'deviceId',
                storeName: 'AllDevices',
                linkStoreName: 'Devices',
                urlApi: 'api/permissions/devices',
                baseObject: user.getId()
            }
        }).show();
    },

    onGroupsClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.settingsGroups,
            items: {
                xtype: 'userGroupsView',
                baseObjectName: 'userId',
                linkObjectName: 'groupId',
                storeName: 'AllGroups',
                linkStoreName: 'Groups',
                urlApi: 'api/permissions/groups',
                baseObject: user.getId()
            }
        }).show();
    },

    onGeofencesClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedGeofences,
            items: {
                xtype: 'userGeofencesView',
                baseObjectName: 'userId',
                linkObjectName: 'geofenceId',
                storeName: 'AllGeofences',
                linkStoreName: 'Geofences',
                urlApi: 'api/permissions/geofences',
                baseObject: user.getId()
            }
        }).show();
    },

    onNotificationsClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedNotifications,
            modal: false,
            items: {
                xtype: 'notificationsView',
                user: user
            }
        }).show();
    },

    onCalendarsClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedCalendars,
            items: {
                xtype: 'userCalendarsView',
                baseObjectName: 'userId',
                linkObjectName: 'calendarId',
                storeName: 'AllCalendars',
                linkStoreName: 'Calendars',
                urlApi: 'api/permissions/calendars',
                baseObject: user.getId()
            }
        }).show();
    },

    onUsersClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.settingsUsers,
            items: {
                xtype: 'userUsersView',
                baseObjectName: 'userId',
                linkObjectName: 'managedUserId',
                storeName: 'Users',
                urlApi: 'api/permissions/users',
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
        this.lookupReference('userUsersButton').setDisabled(disabled || selected[0].get('userLimit') === 0);
        this.callParent(arguments);
    }
});
