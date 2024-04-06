/*
 * Copyright 2016 - 2018 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.edit.Geofences', {
    extend: 'Traccar.view.GridPanel',
    xtype: 'geofencesView',

    requires: [
        'Traccar.view.edit.GeofencesController',
        'Traccar.view.edit.Toolbar'
    ],

    controller: 'geofences',
    store: 'Geofences',

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
            text: Strings.sharedName,
            dataIndex: 'name',
            filter: 'string'
        }, {
            text: Strings.sharedDescription,
            dataIndex: 'description',
            filter: 'string'
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
