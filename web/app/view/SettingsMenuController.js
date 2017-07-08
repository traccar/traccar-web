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

Ext.define('Traccar.view.SettingsMenuController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings',

    requires: [
        'Traccar.view.dialog.LoginController',
        'Traccar.view.dialog.User',
        'Traccar.view.dialog.Server',
        'Traccar.view.edit.Users',
        'Traccar.view.edit.Groups',
        'Traccar.view.edit.Geofences',
        'Traccar.view.Notifications',
        'Traccar.view.edit.AttributeAliases',
        'Traccar.view.edit.ComputedAttributes',
        'Traccar.view.Statistics',
        'Traccar.view.dialog.DeviceDistance',
        'Traccar.view.edit.Calendars',
        'Traccar.view.BaseWindow'
    ],

    init: function () {
        var admin, manager, readonly, deviceReadonly;
        admin = Traccar.app.getUser().get('admin');
        manager = Traccar.app.getUser().get('userLimit') !== 0;
        readonly = Traccar.app.getPreference('readonly', false);
        deviceReadonly = Traccar.app.getUser().get('deviceReadonly');
        if (admin) {
            this.lookupReference('settingsServerButton').setHidden(false);
            this.lookupReference('settingsStatisticsButton').setHidden(false);
            this.lookupReference('settingsDeviceDistanceButton').setHidden(false);
        }
        if (admin || manager) {
            this.lookupReference('settingsUsersButton').setHidden(false);
        }
        if (admin || !readonly) {
            this.lookupReference('settingsUserButton').setHidden(false);
            this.lookupReference('settingsGroupsButton').setHidden(false);
            this.lookupReference('settingsGeofencesButton').setHidden(false);
            this.lookupReference('settingsNotificationsButton').setHidden(false);
            this.lookupReference('settingsCalendarsButton').setHidden(false);
        }
        if (admin || (!deviceReadonly && !readonly)) {
            this.lookupReference('settingsAttributeAliasesButton').setHidden(false);
            this.lookupReference('settingsComputedAttributesButton').setHidden(false);
        }
    },

    onUserClick: function () {
        var dialog = Ext.create('Traccar.view.dialog.User', {
            selfEdit: true
        });
        dialog.down('form').loadRecord(Traccar.app.getUser());
        dialog.lookupReference('testNotificationButton').setHidden(false);
        dialog.show();
    },

    onGroupsClick: function () {
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.settingsGroups,
            items: {
                xtype: 'groupsView'
            }
        }).show();
    },

    onGeofencesClick: function () {
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedGeofences,
            items: {
                xtype: 'geofencesView'
            }
        }).show();
    },

    onServerClick: function () {
        var dialog = Ext.create('Traccar.view.dialog.Server');
        dialog.down('form').loadRecord(Traccar.app.getServer());
        dialog.show();
    },

    onUsersClick: function () {
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.settingsUsers,
            items: {
                xtype: 'usersView'
            }
        }).show();
    },

    onNotificationsClick: function () {
        var user = Traccar.app.getUser();
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedNotifications,
            items: {
                xtype: 'notificationsView',
                user: user
            }
        }).show();
    },

    onAttributeAliasesClick: function () {
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedAttributeAliases,
            items: {
                xtype: 'attributeAliasesView'
            }
        }).show();
    },

    onComputedAttributesClick: function () {
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedComputedAttributes,
            items: {
                xtype: 'computedAttributesView'
            }
        }).show();
    },

    onStatisticsClick: function () {
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.statisticsTitle,
            items: {
                xtype: 'statisticsView'
            }
        }).show();
    },

    onDeviceDistanceClick: function () {
        var dialog = Ext.create('Traccar.view.dialog.DeviceDistance');
        dialog.show();
    },

    onCalendarsClick: function () {
        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.sharedCalendars,
            items: {
                xtype: 'calendarsView'
            }
        }).show();
    },

    onLogoutClick: function () {
        Ext.create('Traccar.view.dialog.LoginController').logout();
    }
});
