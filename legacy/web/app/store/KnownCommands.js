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
Ext.define('Traccar.store.KnownCommands', {
    extend: 'Ext.data.Store',
    model: 'Traccar.model.KnownCommand',

    data: [{
        type: 'custom',
        parameters: [{
            key: 'data',
            name: Strings.commandData,
            valueType: 'string'
        }]
    }, {
        type: 'positionPeriodic',
        parameters: [{
            key: 'frequency',
            name: Strings.commandFrequency,
            valueType: 'number',
            allowDecimals: false,
            minValue: 0,
            dataType: 'frequency'
        }]
    }, {
        type: 'setTimezone',
        parameters: [{
            key: 'timezone',
            name: Strings.commandTimezone,
            valueType: 'string',
            dataType: 'timezone'
        }]
    }, {
        type: 'sendSms',
        parameters: [{
            key: 'phone',
            name: Strings.commandPhone,
            valueType: 'string'
        }, {
            key: 'message',
            name: Strings.commandMessage,
            valueType: 'string'
        }]
    }, {
        type: 'message',
        parameters: [{
            key: 'message',
            name: Strings.commandMessage,
            valueType: 'string'
        }]
    }, {
        type: 'sendUssd',
        parameters: [{
            key: 'phone',
            name: Strings.commandPhone,
            valueType: 'string'
        }]
    }, {
        type: 'sosNumber',
        parameters: [{
            key: 'index',
            name: Strings.commandIndex,
            valueType: 'number',
            allowDecimals: false,
            minValue: 0
        }, {
            key: 'phone',
            name: Strings.commandPhone,
            valueType: 'string'
        }]
    }, {
        type: 'silenceTime',
        parameters: [{
            key: 'data',
            name: Strings.commandData,
            valueType: 'string'
        }]
    }, {
        type: 'setPhonebook',
        parameters: [{
            key: 'data',
            name: Strings.commandData,
            valueType: 'string'
        }]
    }, {
        type: 'voiceMessage',
        parameters: [{
            key: 'data',
            name: Strings.commandData,
            valueType: 'string'
        }]
    }, {
        type: 'outputControl',
        parameters: [{
            key: 'index',
            name: Strings.commandIndex,
            valueType: 'number',
            allowDecimals: false,
            minValue: 0
        }, {
            key: 'data',
            name: Strings.commandData,
            valueType: 'string'
        }]
    }, {
        type: 'voiceMonitoring',
        parameters: [{
            key: 'enable',
            name: Strings.commandEnable,
            valueType: 'boolean'
        }]
    }, {
        type: 'setAgps',
        parameters: [{
            key: 'enable',
            name: Strings.commandEnable,
            valueType: 'boolean'
        }]
    }, {
        type: 'setIndicator',
        parameters: [{
            key: 'data',
            name: Strings.commandData,
            valueType: 'string'
        }]
    }, {
        type: 'configuration',
        parameters: [{
            key: 'data',
            name: Strings.commandData,
            valueType: 'string'
        }]
    }, {
        type: 'setConnection',
        parameters: [{
            key: 'server',
            name: Strings.commandServer,
            valueType: 'string'
        }, {
            key: 'port',
            name: Strings.commandPort,
            valueType: 'number',
            allowDecimals: false,
            minValue: 1,
            maxValue: 65535
        }]
    }, {
        type: 'setOdometer',
        parameters: [{
            key: 'data',
            name: Strings.commandData,
            valueType: 'string'
        }]
    }, {
        type: 'modePowerSaving',
        parameters: [{
            key: 'enable',
            name: Strings.commandEnable,
            valueType: 'boolean'
        }]
    }, {
        type: 'modeDeepSleep',
        parameters: [{
            key: 'enable',
            name: Strings.commandEnable,
            valueType: 'boolean'
        }]
    }, {
        type: 'alarmGeofence',
        parameters: [{
            key: 'radius',
            name: Strings.commandRadius,
            valueType: 'number',
            allowDecimals: false,
            minValue: 0
        }]
    }, {
        type: 'alarmBattery',
        parameters: [{
            key: 'enable',
            name: Strings.commandEnable,
            valueType: 'boolean'
        }]
    }, {
        type: 'alarmSos',
        parameters: [{
            key: 'enable',
            name: Strings.commandEnable,
            valueType: 'boolean'
        }]
    }, {
        type: 'alarmRemove',
        parameters: [{
            key: 'enable',
            name: Strings.commandEnable,
            valueType: 'boolean'
        }]
    }, {
        type: 'alarmClock',
        parameters: [{
            key: 'data',
            name: Strings.commandData,
            valueType: 'string'
        }]
    }, {
        type: 'alarmSpeed',
        parameters: [{
            key: 'data',
            name: Strings.commandData,
            valueType: 'string'
        }]
    }, {
        type: 'alarmFall',
        parameters: [{
            key: 'enable',
            name: Strings.commandEnable,
            valueType: 'boolean'
        }]
    }, {
        type: 'alarmVibration',
        parameters: [{
            key: 'data',
            name: Strings.commandData,
            valueType: 'string'
        }]
    }]
});
