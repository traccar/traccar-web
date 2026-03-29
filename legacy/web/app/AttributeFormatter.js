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

Ext.define('Traccar.AttributeFormatter', {
    singleton: true,

    numberFormatterFactory: function (precision, suffix) {
        return function (value) {
            if (value !== undefined) {
                return Number(value.toFixed(precision)) + ' ' + suffix;
            }
            return null;
        };
    },

    coordinateFormatter: function (key, value) {
        return Ext.getStore('CoordinateFormats').formatValue(key, value, Traccar.app.getPreference('coordinateFormat'));
    },

    speedFormatter: function (value) {
        return Ext.getStore('SpeedUnits').formatValue(value, Traccar.app.getAttributePreference('speedUnit'));
    },

    speedConverter: function (value) {
        return Ext.getStore('SpeedUnits').convertValue(value, Traccar.app.getAttributePreference('speedUnit'));
    },

    courseFormatter: function (value) {
        var courseValues = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return courseValues[Math.floor(value / 45)];
    },

    distanceFormatter: function (value) {
        return Ext.getStore('DistanceUnits').formatValue(value, Traccar.app.getAttributePreference('distanceUnit'));
    },

    distanceConverter: function (value) {
        return Ext.getStore('DistanceUnits').convertValue(value, Traccar.app.getAttributePreference('distanceUnit'));
    },

    volumeFormatter: function (value) {
        return Ext.getStore('VolumeUnits').formatValue(value, Traccar.app.getAttributePreference('volumeUnit'));
    },

    volumeConverter: function (value) {
        return Ext.getStore('VolumeUnits').convertValue(value, Traccar.app.getAttributePreference('volumeUnit'));
    },

    hoursFormatter: function (value) {
        return Ext.getStore('HoursUnits').formatValue(value, 'h');
    },

    hoursConverter: function (value) {
        return Ext.getStore('HoursUnits').convertValue(value, 'h');
    },

    durationFormatter: function (value) {
        return Ext.getStore('HoursUnits').formatValue(value, 'h', true);
    },

    deviceIdFormatter: function (value) {
        var device, store;
        if (value !== 0) {
            store = Ext.getStore('AllDevices');
            if (store.getTotalCount() === 0) {
                store = Ext.getStore('Devices');
            }
            device = store.getById(value);
            return device ? device.get('name') : '';
        }
        return null;
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
        return null;
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
        return null;
    },

    calendarIdFormatter: function (value) {
        var calendar, store;
        if (value !== 0) {
            store = Ext.getStore('AllCalendars');
            if (store.getTotalCount() === 0) {
                store = Ext.getStore('Calendars');
            }
            calendar = store.getById(value);
            return calendar ? calendar.get('name') : '';
        }
        return null;
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
        return null;
    },

    maintenanceIdFormatter: function (value) {
        var maintenance, store;
        if (value !== 0) {
            store = Ext.getStore('AllMaintenances');
            if (store.getTotalCount() === 0) {
                store = Ext.getStore('Maintenances');
            }
            maintenance = store.getById(value);
            return maintenance ? maintenance.get('name') : '';
        }
        return null;
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
        return null;
    },

    commandTypeFormatter: function (value) {
        var name = Strings['command' + value.charAt(0).toUpperCase() + value.slice(1)];
        return name ? name : value;
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

    dateFormatter: function (value) {
        return Ext.Date.format(value, Traccar.Style.dateFormat);
    },

    getFormatter: function (key) {
        var self = this;

        switch (key) {
            case 'latitude':
            case 'longitude':
                return function (value) {
                    return self.coordinateFormatter(key, value);
                };
            case 'speed':
                return this.speedFormatter;
            case 'course':
                return this.courseFormatter;
            case 'distance':
            case 'accuracy':
                return this.distanceFormatter;
            case 'duration':
                return this.durationFormatter;
            case 'deviceId':
                return this.deviceIdFormatter;
            case 'groupId':
                return this.groupIdFormatter;
            case 'geofenceId':
                return this.geofenceIdFormatter;
            case 'maintenanceId':
                return this.maintenanceIdFormatter;
            case 'calendarId':
                return this.calendarIdFormatter;
            case 'lastUpdate':
                return this.lastUpdateFormatter;
            case 'spentFuel':
                return this.volumeFormatter;
            case 'driverUniqueId':
                return this.driverUniqueIdFormatter;
            case 'commandType':
                return this.commandTypeFormatter;
            default:
                return this.defaultFormatter;
        }
    },

    getConverter: function (key) {
        switch (key) {
            case 'speed':
                return this.speedConverter;
            case 'distance':
            case 'accuracy':
                return this.distanceConverter;
            case 'spentFuel':
                return this.volumeConverter;
            default:
                return function (value) {
                    return value;
                };
        }
    },

    getAttributeFormatter: function (key) {
        var dataType = Ext.getStore('PositionAttributes').getAttributeDataType(key);

        switch (dataType) {
            case 'distance':
                return this.distanceFormatter;
            case 'speed':
                return this.speedFormatter;
            case 'driverUniqueId':
                return this.driverUniqueIdFormatter;
            case 'voltage':
                return this.numberFormatterFactory(Traccar.Style.numberPrecision, Strings.sharedVoltAbbreviation);
            case 'percentage':
                return this.numberFormatterFactory(Traccar.Style.numberPrecision, '&#37;');
            case 'temperature':
                return this.numberFormatterFactory(Traccar.Style.numberPrecision, '&deg;C');
            case 'volume':
                return this.volumeFormatter;
            case 'hours':
                return this.hoursFormatter;
            case 'consumption':
                return this.numberFormatterFactory(Traccar.Style.numberPrecision, Strings.sharedLiterPerHourAbbreviation);
            default:
                return this.defaultFormatter;
        }
    },

    getAttributeConverter: function (key) {
        var dataType = Ext.getStore('PositionAttributes').getAttributeDataType(key);

        switch (dataType) {
            case 'distance':
                return this.distanceConverter;
            case 'speed':
                return this.speedConverter;
            case 'volume':
                return this.volumeConverter;
            case 'hours':
                return this.hoursConverter;
            default:
                return function (value) {
                    return value;
                };
        }
    },

    renderAttribute: function (value, attribute) {
        if (attribute && attribute.get('dataType') === 'speed') {
            return Ext.getStore('SpeedUnits').formatValue(value, Traccar.app.getAttributePreference('speedUnit', 'kn'), true);
        } else if (attribute && attribute.get('dataType') === 'distance') {
            return Ext.getStore('DistanceUnits').formatValue(value, Traccar.app.getAttributePreference('distanceUnit', 'km'), true);
        } else if (attribute && attribute.get('dataType') === 'hours') {
            return Ext.getStore('HoursUnits').formatValue(value, 'h', true);
        } else {
            return value;
        }
    }
});
