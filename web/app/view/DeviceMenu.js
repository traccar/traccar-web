/*
 * Copyright 2017 - 2018 Anton Tananaev (anton@traccar.org)
 * Copyright 2017 - 2018 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.view.DeviceMenu', {
    extend: 'Ext.button.Button',
    xtype: 'deviceMenu',

    requires: [
        'Traccar.view.DeviceMenuController'
    ],

    glyph: 'xf013@FontAwesome',
    tooltip: Strings.settingsTitle,
    tooltipType: 'title',

    menu: {
        controller: 'deviceMenu',

        items: [{
            text: Strings.sharedDrivers,
            glyph: 'xf084@FontAwesome',
            handler: 'onDriversClick',
            reference: 'menuDriversButton'
        }, {
            text: Strings.sharedGeofences,
            glyph: 'xf21d@FontAwesome',
            handler: 'onGeofencesClick',
            reference: 'menuGeofencesButton'
        }, {
            text: Strings.sharedNotifications,
            glyph: 'xf003@FontAwesome',
            handler: 'onNotificationsClick',
            reference: 'menuNotificationsButton'
        }, {
            text: Strings.sharedComputedAttributes,
            glyph: 'xf0ae@FontAwesome',
            handler: 'onComputedAttributesClick',
            reference: 'menuComputedAttributesButton'
        }, {
            text: Strings.sharedSavedCommands,
            glyph: 'xf093@FontAwesome',
            handler: 'onCommandsClick',
            reference: 'menuCommandsButton'
        }, {
            text: Strings.sharedMaintenance,
            glyph: 'xf0ad@FontAwesome',
            handler: 'onMaintenancesClick',
            reference: 'menuMaintenancesButton'
        }, {
            hidden: true,
            text: Strings.sharedDeviceAccumulators,
            glyph: 'xf0e4@FontAwesome',
            handler: 'onDeviceAccumulatorsClick',
            reference: 'menuDeviceAccumulatorsButton'
        }]
    }
});
