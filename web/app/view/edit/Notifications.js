/*
 * Copyright 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2017 Andrey Kunitsyn (andrey@traccar.org)
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
            text: Strings.notificationWeb,
            dataIndex: 'web',
            renderer: Traccar.AttributeFormatter.getFormatter('web'),
            filter: 'boolean'
        }, {
            text: Strings.notificationMail,
            dataIndex: 'mail',
            renderer: Traccar.AttributeFormatter.getFormatter('mail'),
            filter: 'boolean'
        }, {
            text: Strings.notificationSms,
            dataIndex: 'sms',
            renderer: Traccar.AttributeFormatter.getFormatter('sms'),
            filter: 'boolean'
        }]
    }
});
