/*
 * Copyright 2015 Anton Tananaev (anton@traccar.org)
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
    extend: 'Ext.app.ViewController',
    alias: 'controller.users',

    requires: [
        'Traccar.view.UserDialog',
        'Traccar.view.UserDevices',
        'Traccar.view.UserGroups',
        'Traccar.view.UserGeofences',
        'Traccar.view.Notifications',
        'Traccar.view.BaseWindow',
        'Traccar.model.User'
    ],

    init: function () {
        Ext.getStore('Users').load();
    },

    onAddClick: function () {
        var user, dialog;
        user = Ext.create('Traccar.model.User');
        dialog = Ext.create('Traccar.view.UserDialog');
        dialog.down('form').loadRecord(user);
        dialog.show();
    },

    onEditClick: function () {
        var user, dialog;
        user = this.getView().getSelectionModel().getSelection()[0];
        dialog = Ext.create('Traccar.view.UserDialog');
        dialog.down('form').loadRecord(user);
        dialog.show();
    },

    onRemoveClick: function () {
        var user = this.getView().getSelectionModel().getSelection()[0];
        Ext.Msg.show({
            title: Strings.settingsUser,
            message: Strings.sharedRemoveConfirm,
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: Strings.sharedRemove,
                no: Strings.sharedCancel
            },
            fn: function (btn) {
                var store = Ext.getStore('Users');
                if (btn === 'yes') {
                    store.remove(user);
                    store.sync();
                }
            }
        });
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

    onSelectionChange: function (selected) {
        var disabled = selected.length > 0;
        this.lookupReference('toolbarEditButton').setDisabled(disabled);
        this.lookupReference('toolbarRemoveButton').setDisabled(disabled);
        this.lookupReference('userDevicesButton').setDisabled(disabled);
        this.lookupReference('userGroupsButton').setDisabled(disabled);
        this.lookupReference('userGeofencesButton').setDisabled(disabled);
        this.lookupReference('userNotificationsButton').setDisabled(disabled);
    }
});
