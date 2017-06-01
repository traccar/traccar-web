/*
 * Copyright 2015 - 2017 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.model.Event', {
    extend: 'Ext.data.Model',
    identifier: 'negative',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'type',
        type: 'string'
    }, {
        name: 'serverTime',
        type: 'date',
        dateFormat: 'c'
    }, {
        name: 'deviceId',
        type: 'int'
    }, {
        name: 'positionId',
        type: 'int'
    }, {
        name: 'geofenceId',
        type: 'int'
    }, {
        name: 'text',
        calculate: function (data) {
            var text, alarmKey, geofence;
            if (data.type === 'commandResult') {
                text = Strings.eventCommandResult + ': ' + data.attributes.result;
            } else if (data.type === 'alarm') {
                alarmKey = 'alarm' + data.attributes.alarm.charAt(0).toUpperCase() + data.attributes.alarm.slice(1);
                text = Strings[alarmKey] || alarmKey;
            } else if (data.type === 'textMessage') {
                text = Strings.eventTextMessage + ': ' + data.attributes.message;
            } else {
                text = Traccar.app.getEventString(data.type);
            }
            if (data.geofenceId !== 0) {
                geofence = Ext.getStore('Geofences').getById(data.geofenceId);
                if (geofence) {
                    text += ' \"' + geofence.get('name') + '"';
                }
            }
            return text;
        }
    }, {
        name: 'attributes'
    }]
});
