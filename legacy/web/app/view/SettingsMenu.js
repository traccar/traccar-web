/*
 * Copyright 2015 - 2018 Anton Tananaev (anton@traccar.org)
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
    tooltip: Strings.settingsTitle,
    tooltipType: 'title',

    menu: {
        controller: 'settings',

        items: [{
            hidden: true,
            text: Strings.settingsUser,
            glyph: 'xf007@FontAwesome',
            handler: 'onUserClick',
            reference: 'settingsUserButton'
        }, {
            hidden: true,
            text: Strings.settingsGroups,
            glyph: 'xf247@FontAwesome',
            handler: 'onGroupsClick',
            reference: 'settingsGroupsButton'
        }, {
            hidden: true,
            text: Strings.sharedDrivers,
            glyph: 'xf084@FontAwesome',
            handler: 'onDriversClick',
            reference: 'settingsDriversButton'
        }, {
            hidden: true,
            text: Strings.sharedGeofences,
            glyph: 'xf21d@FontAwesome',
            handler: 'onGeofencesClick',
            reference: 'settingsGeofencesButton'
        }, {
            hidden: true,
            text: Strings.settingsServer,
            glyph: 'xf233@FontAwesome',
            handler: 'onServerClick',
            reference: 'settingsServerButton'
        }, {
            hidden: true,
            text: Strings.settingsUsers,
            glyph: 'xf0c0@FontAwesome',
            handler: 'onUsersClick',
            reference: 'settingsUsersButton'
        }, {
            hidden: true,
            text: Strings.sharedNotifications,
            glyph: 'xf003@FontAwesome',
            handler: 'onNotificationsClick',
            reference: 'settingsNotificationsButton'
        }, {
            hidden: true,
            text: Strings.sharedComputedAttributes,
            glyph: 'xf0ae@FontAwesome',
            handler: 'onComputedAttributesClick',
            reference: 'settingsComputedAttributesButton'
        }, {
            hidden: true,
            text: Strings.statisticsTitle,
            glyph: 'xf080@FontAwesome',
            handler: 'onStatisticsClick',
            reference: 'settingsStatisticsButton'
        }, {
            hidden: true,
            text: Strings.sharedCalendars,
            glyph: 'xf073@FontAwesome',
            handler: 'onCalendarsClick',
            reference: 'settingsCalendarsButton'
        }, {
            hidden: true,
            text: Strings.sharedSavedCommands,
            glyph: 'xf093@FontAwesome',
            handler: 'onCommandsClick',
            reference: 'settingsCommandsButton'
        }, {
            hidden: true,
            text: Strings.sharedMaintenance,
            glyph: 'xf0ad@FontAwesome',
            handler: 'onMaintenancesClick',
            reference: 'settingsMaintenancesButton'
        }, {
            text: Strings.loginLogout,
            glyph: 'xf08b@FontAwesome',
            handler: 'onLogoutClick'
        }]
    }
});
