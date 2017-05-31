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

    coordinateFormatter: function (key, value) {
        return Ext.getStore('CoordinateFormats').formatValue(key, value, Traccar.app.getPreference('coordinateFormat'));
    },

    speedFormatter: function (value) {
        return Ext.getStore('SpeedUnits').formatValue(value, Traccar.app.getPreference('speedUnit'));
    },

    courseFormatter: function (value) {
        var courseValues = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return courseValues[Math.floor(value / 45)];
    },

    distanceFormatter: function (value) {
        return Ext.getStore('DistanceUnits').formatValue(value, Traccar.app.getPreference('distanceUnit'));
    },

    voltageFormatter: function (value) {
        return Number(value.toFixed(Traccar.Style.numberPrecision)) + ' ' + Strings.sharedVoltAbbreviation;
    },

    percentageFormatter: function (value) {
        return Number(value.toFixed(Traccar.Style.numberPrecision)) + ' &#37;';
    },

    temperatureFormatter: function (value) {
        return Number(value.toFixed(Traccar.Style.numberPrecision)) + ' &deg;C';
    },

    volumeFormatter: function (value) {
        return Number(value.toFixed(Traccar.Style.numberPrecision)) + ' ' + Strings.sharedLiterAbbreviation;
    },

    consumptionFormatter: function (value) {
        return Number(value.toFixed(Traccar.Style.numberPrecision)) + ' ' + Strings.sharedLiterPerHourAbbreviation;
    },

    hoursFormatter: function (value) {
        var hours = Math.round(value / 3600000);
        return (hours + ' ' + Strings.sharedHourAbbreviation);
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
        } else if (key === 'hours') {
            return this.hoursFormatter;
        } else if (key === 'duration') {
            return this.durationFormatter;
        } else if (key === 'deviceId') {
            return this.deviceIdFormatter;
        } else if (key === 'lastUpdate') {
            return this.lastUpdateFormatter;
        } else {
            return this.defaultFormatter;
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
            } else if (dataType === 'voltage') {
                return this.voltageFormatter;
            } else if (dataType === 'percentage') {
                return this.percentageFormatter;
            } else if (dataType === 'temperature') {
                return this.temperatureFormatter;
            } else if (dataType === 'volume') {
                return this.volumeFormatter;
            } else if (dataType === 'consumption') {
                return this.consumptionFormatter;
            } else {
                return this.defaultFormatter;
            }
        }
    }
});
