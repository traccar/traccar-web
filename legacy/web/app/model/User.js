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

Ext.define('Traccar.model.User', {
    extend: 'Ext.data.Model',
    identifier: 'negative',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'login',
        type: 'string'
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'password',
        type: 'string'
    }, {
        name: 'phone',
        type: 'string'
    }, {
        name: 'readonly',
        type: 'boolean'
    }, {
        name: 'administrator',
        type: 'boolean'
    }, {
        name: 'map',
        type: 'string'
    }, {
        name: 'latitude',
        type: 'float'
    }, {
        name: 'longitude',
        type: 'float'
    }, {
        name: 'zoom',
        type: 'int'
    }, {
        name: 'twelveHourFormat',
        type: 'boolean'
    }, {
        name: 'coordinateFormat',
        type: 'string'
    }, {
        name: 'disabled',
        type: 'boolean'
    }, {
        name: 'expirationTime',
        type: 'date',
        dateFormat: 'c'
    }, {
        name: 'deviceLimit',
        type: 'int'
    }, {
        name: 'userLimit',
        type: 'int'
    }, {
        name: 'deviceReadonly',
        type: 'boolean'
    }, {
        name: 'limitCommands',
        type: 'boolean'
    }, {
        name: 'disableReports',
        type: 'boolean'
    }, {
        name: 'poiLayer',
        type: 'string'
    }, {
        name: 'attributes'
    }],

    proxy: {
        type: 'rest',
        url: 'api/users',
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});
