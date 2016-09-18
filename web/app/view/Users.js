/*
 * Copyright 2015 Anton Tananaev (anton.tananaev@gmail.com)
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

Ext.define('Traccar.view.Users', {
    extend: 'Ext.grid.Panel',
    xtype: 'usersView',

    requires: [
        'Traccar.view.UsersController',
        'Traccar.view.EditToolbar'
    ],

    controller: 'users',
    store: 'Users',

    selType: 'rowmodel',

    tbar: {
        xtype: 'editToolbar',
        items: [{
            text: Strings.deviceTitle,
            disabled: true,
            handler: 'onDevicesClick',
            reference: 'userDevicesButton'
        }, {
            text: Strings.settingsGroups,
            disabled: true,
            handler: 'onGroupsClick',
            reference: 'userGroupsButton'
        }, {
            text: Strings.sharedGeofences,
            disabled: true,
            handler: 'onGeofencesClick',
            reference: 'userGeofencesButton'
        }, {
            text: Strings.sharedNotifications,
            disabled: true,
            handler: 'onNotificationsClick',
            reference: 'userNotificationsButton'
        }]
    },

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    columns: [{
        text: Strings.sharedName,
        dataIndex: 'name',
        flex: 1
    }, {
        text: Strings.userEmail,
        dataIndex: 'email',
        flex: 1
    }, {
        text: Strings.userAdmin,
        dataIndex: 'admin',
        flex: 1
    }]
});
