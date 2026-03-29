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

Ext.define('Traccar.view.permissions.Notifications', {
    extend: 'Traccar.view.permissions.Base',
    xtype: 'linkNotificationsView',

    columns: {
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
            flex: 1,
            minWidth: Traccar.Style.columnWidthNormal,
            renderer: Traccar.AttributeFormatter.getFormatter('always'),
            filter: 'boolean'
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
            flex: 1,
            minWidth: Traccar.Style.columnWidthNormal,
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
