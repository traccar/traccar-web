/*
 * Copyright 2016 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.Notifications', {
    extend: 'Ext.grid.Panel',
    xtype: 'notificationsView',

    requires: [
        'Traccar.view.NotificationsController'
    ],

    controller: 'notificationsController',
    store: 'AllNotifications',

    selModel: {
        selType: 'cellmodel'
    },

    viewConfig: {
        markDirty: false
    },

    forceFit: true,

    columns: {
        defaults: {
            minWidth: Traccar.Style.columnWidthNormal
        },
        items: [{
            text: Strings.notificationType,
            dataIndex: 'type',
            renderer: function (value) {
                return Traccar.app.getEventString(value);
            }
        }, {
            text: Strings.notificationWeb,
            dataIndex: 'attributes.web',
            xtype: 'checkcolumn',
            listeners: {
                beforeCheckChange: 'onBeforeCheckChange',
                checkChange: 'onCheckChange'
            },
            renderer: function (value, metaData, record) {
                var fields = this.dataIndex.split('\.', 2);
                return (new Ext.ux.CheckColumn()).renderer(record.get(fields[0])[fields[1]], metaData);
            }
        }, {
            text: Strings.notificationMail,
            dataIndex: 'attributes.mail',
            xtype: 'checkcolumn',
            listeners: {
                beforeCheckChange: 'onBeforeCheckChange',
                checkChange: 'onCheckChange'
            },
            renderer: function (value, metaData, record) {
                var fields = this.dataIndex.split('\.', 2);
                return (new Ext.ux.CheckColumn()).renderer(record.get(fields[0])[fields[1]], metaData);
            }
        }]
    }
});
