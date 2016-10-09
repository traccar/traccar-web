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

Ext.define('Traccar.view.SettingsMenu', {
    extend: 'Ext.button.Button',
    xtype: 'settingsMenu',

    requires: [
        'Traccar.view.SettingsMenuController'
    ],

    glyph: 'xf013@FontAwesome',
    text: Strings.settingsTitle,

    menu: {
        controller: 'settings',

        items: [{
            text: Strings.settingsUser,
            handler: 'onUserClick'
        }, {
            hidden: true,
            text: Strings.settingsGroups,
            handler: 'onGroupsClick',
            reference: 'settingsGroupsButton'
        }, {
            hidden: true,
            text: Strings.sharedGeofences,
            handler: 'onGeofencesClick',
            reference: 'settingsGeofencesButton'
        }, {
            text: Strings.settingsServer,
            hidden: true,
            handler: 'onServerClick',
            reference: 'settingsServerButton'
        }, {
            text: Strings.settingsUsers,
            hidden: true,
            handler: 'onUsersClick',
            reference: 'settingsUsersButton'
        }, {
            text: Strings.sharedNotifications,
            handler: 'onNotificationsClick',
            reference: 'settingsNotificationsButton'
        }, {
            hidden: true,
            text: Strings.sharedAttributeAliases,
            handler: 'onAttributeAliasesClick',
            reference: 'settingsAttributeAliasesButton'
        }, {
            hidden: true,
            text: Strings.statisticsTitle,
            handler: 'onStatisticsClick',
            reference: 'settingsStatisticsButton'
        }, {
            text: Strings.loginLogout,
            handler: 'onLogoutClick'
        }]
    }
});
