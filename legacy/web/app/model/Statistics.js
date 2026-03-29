/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.model.Statistics', {
    extend: 'Ext.data.Model',
    identifier: 'negative',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'captureTime',
        type: 'date',
        dateFormat: 'c'
    }, {
        name: 'activeUsers',
        type: 'int'
    }, {
        name: 'activeDevices',
        type: 'int'
    }, {
        name: 'requests',
        type: 'int'
    }, {
        name: 'messagesReceived',
        type: 'int'
    }, {
        name: 'messagesStored',
        type: 'int'
    }, {
        name: 'mailSent',
        type: 'int'
    }, {
        name: 'smsSent',
        type: 'int'
    }, {
        name: 'geocoderRequests',
        type: 'int'
    }, {
        name: 'geolocationRequests',
        type: 'int'
    }, {
        name: 'attributes'
    }]
});
