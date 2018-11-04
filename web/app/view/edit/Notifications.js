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

Ext.define('Traccar.view.edit.Notifications', {
    extend: 'Traccar.view.GridPanel',
    xtype: 'notificationsView',

    requires: [
        'Traccar.view.edit.NotificationsController',
        'Traccar.view.edit.Toolbar'
    ],

    controller: 'notifications',
    store: 'Notifications',

    tbar: {
        xtype: 'editToolbar'
    },

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    columns: {
        defaults: {
            flex: 1,
            minWidth: Traccar.Style.columnWidthNormal
        },
        items: [{
            text: Strings.notificationType,
            dataIndex: 'type',
            flex: 2,
            renderer: function (value) {
                return Traccar.app.getEventString(value);
            },
            filter: {
                type: 'list',
                idField: 'type',
                labelField: 'name',
                store: 'AllNotificationTypes'
            }
        }, {
            text: Strings.notificationAlways,
            dataIndex: 'always',
            renderer: Traccar.AttributeFormatter.getFormatter('always'),
            filter: 'boolean'
        }, {
            text: Strings.sharedAlarms,
            dataIndex: 'attributes',
            renderer: function (value) {
                var i, key, result = '', alarms = value && value['alarms'];
                if (alarms) {
                    alarms = alarms.split(',');
                    for (i = 0; i < alarms.length; i++) {
                        key = 'alarm' + alarms[i].charAt(0).toUpperCase() + alarms[i].slice(1);
                        if (result) {
                            result += ', ';
                        }
                        result += Strings[key] || key;
                    }
                }
                return result;
            }
        }, {
            text: Strings.notificationNotificators,
            dataIndex: 'notificators',
            flex: 2,
            filter: {
                type: 'arraylist',
                idField: 'type',
                labelField: 'name',
                store: 'AllNotificators'
            },
            renderer: function (value) {
                var result = '', i, notificators;
                if (value) {
                    notificators = value.split(/[ ,]+/).filter(Boolean);
                    for (i = 0; i < notificators.length; i++) {
                        result += Traccar.app.getNotificatorString(notificators[i]) + (i < notificators.length - 1 ? ', ' : '');
                    }
                }
                return result;
            }
        }, {
            text: Strings.sharedCalendar,
            dataIndex: 'calendarId',
            hidden: true,
            filter: {
                type: 'list',
                labelField: 'name',
                store: 'AllCalendars'
            },
            renderer: Traccar.AttributeFormatter.getFormatter('calendarId')
        }]
    }
});
