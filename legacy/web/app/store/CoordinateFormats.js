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

Ext.define('Traccar.store.CoordinateFormats', {
    extend: 'Ext.data.Store',
    fields: ['key', 'name'],

    data: [{
        key: 'dd',
        name: Strings.sharedDecimalDegrees
    }, {
        key: 'ddm',
        name: Strings.sharedDegreesDecimalMinutes
    }, {
        key: 'dms',
        name: Strings.sharedDegreesMinutesSeconds
    }],

    formatValue: function (key, value, unit) {
        var hemisphere, degrees, minutes, seconds;
        if (key === 'latitude') {
            hemisphere = value >= 0 ? 'N' : 'S';
        } else {
            hemisphere = value >= 0 ? 'E' : 'W';
        }
        switch (unit) {
            case 'ddm':
                value = Math.abs(value);
                degrees = Math.floor(value);
                minutes = (value - degrees) * 60;
                return degrees + '° ' + minutes.toFixed(Traccar.Style.coordinatePrecision) + '\' ' + hemisphere;
            case 'dms':
                value = Math.abs(value);
                degrees = Math.floor(value);
                minutes = Math.floor((value - degrees) * 60);
                seconds = Math.round((value - degrees - minutes / 60) * 3600);
                return degrees + '° ' + minutes + '\' ' + seconds + '" ' + hemisphere;
            default:
                return value.toFixed(Traccar.Style.coordinatePrecision) + '°';
        }
    }
});
