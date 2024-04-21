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
Ext.define('Traccar.store.PositionAttributes', {
    extend: 'Ext.data.Store',
    model: 'Traccar.model.KnownAttribute',
    proxy: 'memory',

    data: [{
        key: 'raw',
        name: Strings.positionRaw,
        valueType: 'string'
    }, {
        key: 'index',
        name: Strings.positionIndex,
        valueType: 'number'
    }, {
        key: 'hdop',
        name: Strings.positionHdop,
        valueType: 'number'
    }, {
        key: 'vdop',
        name: Strings.positionVdop,
        valueType: 'number'
    }, {
        key: 'pdop',
        name: Strings.positionPdop,
        valueType: 'number'
    }, {
        key: 'sat',
        name: Strings.positionSat,
        valueType: 'number'
    }, {
        key: 'satVisible',
        name: Strings.positionSatVisible,
        valueType: 'number'
    }, {
        key: 'rssi',
        name: Strings.positionRssi,
        valueType: 'number'
    }, {
        key: 'gps',
        name: Strings.positionGps,
        valueType: 'number'
    }, {
        key: 'roaming',
        name: Strings.positionRoaming,
        valueType: 'boolean'
    }, {
        key: 'event',
        name: Strings.positionEvent,
        valueType: 'string'
    }, {
        key: 'alarm',
        name: Strings.positionAlarm,
        valueType: 'string'
    }, {
        key: 'status',
        name: Strings.positionStatus,
        valueType: 'string'
    }, {
        key: 'odometer',
        name: Strings.positionOdometer,
        valueType: 'number',
        dataType: 'distance'
    }, {
        key: 'serviceOdometer',
        name: Strings.positionServiceOdometer,
        valueType: 'number',
        dataType: 'distance'
    }, {
        key: 'tripOdometer',
        name: Strings.positionTripOdometer,
        valueType: 'number',
        dataType: 'distance'
    }, {
        key: 'hours',
        name: Strings.positionHours,
        valueType: 'number',
        dataType: 'hours'
    }, {
        key: 'steps',
        name: Strings.positionSteps,
        valueType: 'number'
    }, {
        key: 'input',
        name: Strings.positionInput,
        valueType: 'string'
    }, {
        key: 'output',
        name: Strings.positionOutput,
        valueType: 'string'
    }, {
        key: 'power',
        name: Strings.positionPower,
        valueType: 'number',
        dataType: 'voltage'
    }, {
        key: 'battery',
        name: Strings.positionBattery,
        valueType: 'number',
        dataType: 'voltage'
    }, {
        key: 'batteryLevel',
        name: Strings.positionBatteryLevel,
        valueType: 'number',
        dataType: 'percentage'
    }, {
        key: 'fuel',
        name: Strings.positionFuel,
        valueType: 'number',
        dataType: 'volume'
    }, {
        key: 'fuelConsumption',
        name: Strings.positionFuelConsumption,
        valueType: 'number',
        dataType: 'consumption'
    }, {
        key: 'versionFw',
        name: Strings.positionVersionFw,
        valueType: 'string'
    }, {
        key: 'versionHw',
        name: Strings.positionVersionHw,
        valueType: 'string'
    }, {
        key: 'type',
        name: Strings.sharedType,
        valueType: 'string'
    }, {
        key: 'ignition',
        name: Strings.positionIgnition,
        valueType: 'boolean'
    }, {
        key: 'flags',
        name: Strings.positionFlags,
        valueType: 'string'
    }, {
        key: 'charge',
        name: Strings.positionCharge,
        valueType: 'boolean'
    }, {
        key: 'ip',
        name: Strings.positionIp,
        valueType: 'string'
    }, {
        key: 'archive',
        name: Strings.positionArchive,
        valueType: 'boolean'
    }, {
        key: 'distance',
        name: Strings.positionDistance,
        valueType: 'number',
        dataType: 'distance'
    }, {
        key: 'totalDistance',
        name: Strings.deviceTotalDistance,
        valueType: 'number',
        dataType: 'distance'
    }, {
        key: 'rpm',
        name: Strings.positionRpm,
        valueType: 'number'
    }, {
        key: 'vin',
        name: Strings.positionVin,
        valueType: 'string'
    }, {
        key: 'approximate',
        name: Strings.positionApproximate,
        valueType: 'boolean'
    }, {
        key: 'throttle',
        name: Strings.positionThrottle,
        valueType: 'number'
    }, {
        key: 'motion',
        name: Strings.positionMotion,
        valueType: 'boolean'
    }, {
        key: 'armed',
        name: Strings.positionArmed,
        valueType: 'number'
    }, {
        key: 'geofence',
        name: Strings.sharedGeofence,
        valueType: 'string'
    }, {
        key: 'acceleration',
        name: Strings.positionAcceleration,
        valueType: 'number'
    }, {
        key: 'deviceTemp',
        name: Strings.positionDeviceTemp,
        valueType: 'number',
        dataType: 'temperature'
    }, {
        key: 'operator',
        name: Strings.positionOperator,
        valueType: 'string'
    }, {
        key: 'command',
        name: Strings.deviceCommand,
        valueType: 'string'
    }, {
        key: 'blocked',
        name: Strings.positionBlocked,
        valueType: 'boolean'
    }, {
        key: 'dtcs',
        name: Strings.positionDtcs,
        valueType: 'string'
    }, {
        key: 'obdSpeed',
        name: Strings.positionObdSpeed,
        valueType: 'number',
        dataType: 'speed'
    }, {
        key: 'obdOdometer',
        name: Strings.positionObdOdometer,
        valueType: 'number',
        dataType: 'distance'
    }, {
        key: 'result',
        name: Strings.eventCommandResult,
        valueType: 'string'
    }, {
        key: 'driverUniqueId',
        name: Strings.positionDriverUniqueId,
        valueType: 'string',
        dataType: 'driverUniqueId'
    }],

    getAttributeName: function (key, capitalize) {
        var model = this.getById(key);
        if (model) {
            return model.get('name');
        } else if (capitalize) {
            return key.replace(/^./, function (match) {
                return match.toUpperCase();
            });
        } else {
            return key;
        }
    },

    getAttributeDataType: function (key) {
        var model = this.getById(key);
        if (model && model.get('dataType')) {
            return model.get('dataType');
        } else {
            return null;
        }
    }
});
