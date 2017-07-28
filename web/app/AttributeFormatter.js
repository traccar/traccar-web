/*
 * Copyright 2015 - 2016 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.AttributeFormatter', {
    singleton: true,

    numberFormatterFactory: function (precision, suffix) {
        return function (value) {
            if (value !== undefined) {
                return Number(value.toFixed(precision)) + ' ' + suffix;
            }
        };
    },

    coordinateFormatter: function (key, value) {
        return Ext.getStore('CoordinateFormats').formatValue(key, value, Traccar.app.getPreference('coordinateFormat'));
    },

    speedFormatter: function (value) {
        return Ext.getStore('SpeedUnits').formatValue(value, Traccar.app.getPreference('speedUnit'));
    },

    speedConverter: function (value) {
        return Ext.getStore('SpeedUnits').convertValue(value, Traccar.app.getPreference('speedUnit'));
    },

    courseFormatter: function (value) {
        var courseValues = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return courseValues[Math.floor(value / 45)];
    },

    distanceFormatter: function (value) {
        return Ext.getStore('DistanceUnits').formatValue(value, Traccar.app.getPreference('distanceUnit'));
    },

    distanceConverter: function (value) {
        return Ext.getStore('DistanceUnits').convertValue(value, Traccar.app.getPreference('distanceUnit'));
    },

    durationFormatter: function (value) {
        var hours, minutes;
        hours = Math.floor(value / 3600000);
        minutes = Math.round((value % 3600000) / 60000);
        return (hours + ' ' + Strings.sharedHourAbbreviation + ' ' + minutes + ' ' + Strings.sharedMinuteAbbreviation);
    },

    deviceIdFormatter: function (value) {
        return Ext.getStore('Devices').getById(value).get('name');
    },

    groupIdFormatter: function (value) {
        var group, store;
        if (value !== 0) {
            store = Ext.getStore('AllGroups');
            if (store.getTotalCount() === 0) {
                store = Ext.getStore('Groups');
            }
            group = store.getById(value);
            return group ? group.get('name') : value;
        }
    },

    geofenceIdFormatter: function (value) {
        var geofence, store;
        if (value !== 0) {
            store = Ext.getStore('AllGeofences');
            if (store.getTotalCount() === 0) {
                store = Ext.getStore('Geofences');
            }
            geofence = store.getById(value);
            return geofence ? geofence.get('name') : '';
        }
    },

    driverUniqueIdFormatter: function (value) {
        var driver, store;
        if (value !== 0) {
            store = Ext.getStore('AllDrivers');
            if (store.getTotalCount() === 0) {
                store = Ext.getStore('Drivers');
            }
            driver = store.findRecord('uniqueId', value, 0, false, true, true);
            return driver ? value + ' (' + driver.get('name') + ')' : value;
        }
    },

    lastUpdateFormatter: function (value) {
        var seconds, interval;

        if (value) {
            seconds = Math.floor((new Date() - value) / 1000);
            if (seconds < 0) {
                seconds = 0;
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + ' ' + Strings.sharedDays;
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + ' ' + Strings.sharedHours;
            }
            return Math.floor(seconds / 60) + ' ' + Strings.sharedMinutes;
        }
    },

    defaultFormatter: function (value) {
        if (typeof value === 'number') {
            return Number(value.toFixed(Traccar.Style.numberPrecision));
        } else if (typeof value === 'boolean') {
            return value ? Ext.Msg.buttonText.yes : Ext.Msg.buttonText.no;
        } else if (value instanceof Date) {
            if (Traccar.app.getPreference('twelveHourFormat', false)) {
                return Ext.Date.format(value, Traccar.Style.dateTimeFormat12);
            } else {
                return Ext.Date.format(value, Traccar.Style.dateTimeFormat24);
            }
        }
        return value;
    },

    getFormatter: function (key) {
        var self = this;
        if (key === 'latitude' || key === 'longitude') {
            return function (value) {
                return self.coordinateFormatter(key, value);
            };
        } else if (key === 'speed') {
            return this.speedFormatter;
        } else if (key === 'course') {
            return this.courseFormatter;
        } else if (key === 'distance' || key === 'accuracy') {
            return this.distanceFormatter;
        } else if (key === 'duration') {
            return this.durationFormatter;
        } else if (key === 'deviceId') {
            return this.deviceIdFormatter;
        } else if (key === 'groupId') {
            return this.groupIdFormatter;
        } else if (key === 'geofenceId') {
            return this.geofenceIdFormatter;
        } else if (key === 'lastUpdate') {
            return this.lastUpdateFormatter;
        } else if (key === 'spentFuel') {
            return this.numberFormatterFactory(Traccar.Style.numberPrecision, Strings.sharedLiterAbbreviation);
        } else if (key === 'driverUniqueId') {
            return this.driverUniqueIdFormatter;
        } else {
            return this.defaultFormatter;
        }
    },

    getConverter: function (key) {
        if (key === 'speed') {
            return this.speedConverter;
        } else if (key === 'distance' || key === 'accuracy') {
            return this.distanceConverter;
        } else {
            return function (value) {
                return value;
            };
        }
    },

    getAttributeFormatter: function (key) {
        var dataType = Ext.getStore('PositionAttributes').getAttributeDataType(key);
        if (!dataType) {
            return this.defaultFormatter;
        } else {
            if (dataType === 'distance') {
                return this.distanceFormatter;
            } else if (dataType === 'speed') {
                return this.speedFormatter;
            } else if (dataType === 'driverUniqueId') {
                return this.driverUniqueIdFormatter;
            } else if (dataType === 'voltage') {
                return this.numberFormatterFactory(Traccar.Style.numberPrecision, Strings.sharedVoltAbbreviation);
            } else if (dataType === 'percentage') {
                return this.numberFormatterFactory(Traccar.Style.numberPrecision, '&#37;');
            } else if (dataType === 'temperature') {
                return this.numberFormatterFactory(Traccar.Style.numberPrecision, '&deg;C');
            } else if (dataType === 'volume') {
                return this.numberFormatterFactory(Traccar.Style.numberPrecision, Strings.sharedLiterAbbreviation);
            } else if (dataType === 'consumption') {
                return this.numberFormatterFactory(Traccar.Style.numberPrecision, Strings.sharedLiterPerHourAbbreviation);
            } else {
                return this.defaultFormatter;
            }
        }
    },

    getAttributeConverter: function (key) {
        var dataType = Ext.getStore('PositionAttributes').getAttributeDataType(key);
        if (!dataType) {
            return function (value) {
                return value;
            };
        } else {
            if (dataType === 'distance') {
                return this.distanceConverter;
            } else if (dataType === 'speed') {
                return this.speedConverter;
            } else {
                return function (value) {
                    return value;
                };
            }
        }
    }
});
